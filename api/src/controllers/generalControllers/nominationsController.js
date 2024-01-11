const express = require("express");
const router = express.Router();
const {
  Nominations,
  CoSupervisor,
  Student,
  ExternalExaminer,
  InternalExaminer,
} = require("../../models/generalModels/nominationsModel");
const lecturer = require("../../models/usersModels/lecturerModel");
const student = require("../../models/usersModels/studentModel");

const jwt = require("jsonwebtoken");

// POST endpoint to create a new nomination entry
const hasNonEmptyField = (data) => {
  for (const key in data) {
    if (data[key] !== null && data[key] !== undefined && data[key] !== "") {
      return true;
    }
  }
  return false;
};

async function createNomination(req, res) {
  const token = req.headers.authorization;
  try {
    const decoded = jwt.verify(token, process.env.SECRET_TOKEN);
    const supervisorId = decoded.user_id;
    const {
      coSupervisors,
      student,
      internalExaminers,
      externalExaminers,
      passedDisserationTwo,
      passedElectivesAndCores,
      examinersNotified,
    } = req.body;

    // Check if all fields are empty
    if (
      !hasNonEmptyField(student) &&
      !coSupervisors.some(hasNonEmptyField) &&
      !internalExaminers.some(hasNonEmptyField) &&
      !externalExaminers.some(hasNonEmptyField)
    ) {
      return res.status(400).json({ error: "All fields cannot be empty" });
    }
    // Create instances for related classes
    const coSupervisorsInstances = coSupervisors.map(
      (coSupervisor) => new CoSupervisor(coSupervisor)
    );

    const studentInstance = new Student(student);

    const internalExaminersInstances = internalExaminers.map(
      (examiner) => new InternalExaminer(examiner)
    );
    const externalExaminersInstances = externalExaminers.map(
      (examiner) => new ExternalExaminer(examiner)
    );

    // Create a new Nominations instance
    const newNomination = new Nominations({
      supervisorId,
      coSupervisors: coSupervisorsInstances.map((coSupervisor) =>
        coSupervisor.toPlainObject()
      ),
      student: studentInstance.toPlainObject(),
      internalExaminers: internalExaminersInstances.map((examiner) =>
        examiner.toPlainObject()
      ),
      externalExaminers: externalExaminersInstances.map((examiner) =>
        examiner.toPlainObject()
      ),
      passedDisserationTwo,
      passedElectivesAndCores,
      examinersNotified,
      createdAt: new Date(),
    });

    // Save the new nomination entry to the database
    const nominationId = await newNomination.save();

    return res
      .status(200)
      .json({ message: "Nomination created successfully", nominationId });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

async function getNominationById(req, res) {
  const { nominationId } = req.params;

  try {
    const nominationData = await Nominations.getNominationById(nominationId);

    if (!nominationData) {
      return res.status(404).json({ error: "Nomination not found" });
    }
    const formattedNominationData =
      Nominations.formatNominationData(nominationData);
    return res.status(200).json(formattedNominationData);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

async function getAllNominations(req, res) {
  try {
    const nominations = await Nominations.getAllNominations();
    if (!nominations || nominations.length === 0) {
      return res.status(404).json({ error: "No nominations found" });
    }

    const lecturerIds = nominations.map(
      (nomination) => nomination.supervisorId
    );
    const lecturerDetails = await Promise.all(
      lecturerIds.map((id) => lecturer.getUserById(id))
    );

    const formattedNominations = await Promise.all(
      nominations.map(async (nomination) => {
        nomination.supervisorName = lecturerDetails.find(
          (lecturer) => lecturer.user_id === nomination.supervisorId
        ).username;

        // Check if co-supervisors exist by email
        await Promise.all(
          nomination.coSupervisors.map(async (coSupervisor) => {
            const coSupervisorUser = await lecturer.getUserByEmail(
              coSupervisor.email
            );
            if (coSupervisorUser) {
              coSupervisor.userId = coSupervisorUser.user_id;
            }
            coSupervisor.coSupervisorsExist = !!coSupervisorUser;
          })
        );

        // Check if external examiners exist by email
        await Promise.all(
          nomination.externalExaminers.map(async (examiner) => {
            const examinerUser = await lecturer.getUserByEmail(examiner.email);
            if (examinerUser) {
              examiner.userId = examinerUser.user_id;
              examiner.examinees = examinerUser.examinees;
            }
            examiner.externalExaminersExist = !!examinerUser;
          })
        );

        // Check if student exists by email
        const utmUser = await student.getUserByEmail(
          nomination.student.utmEmail
        );
        if (utmUser) {
          nomination.student.userId = utmUser.user_id;
          nomination.student.examiners = utmUser.examiners;
          nomination.student.studentExists = true;
        } else {
          const emailUser = await student.getUserByEmail(
            nomination.student.email
          );
          if (emailUser) {
            nomination.student.userId = emailUser.user_id;
            nomination.student.examiners = emailUser.examiners;
            nomination.student.studentExists = true;
          }
          nomination.student.studentExists = !!emailUser;
        }

        // Check if internal examiners exist by email
        await Promise.all(
          nomination.internalExaminers.map(async (examiner) => {
            const examinerUser = await lecturer.getUserByEmail(examiner.email);

            if (examinerUser) {
              examiner.userId = examinerUser.user_id;
              examiner.examinees = examinerUser.examinees;
            }
            examiner.internalExaminersExist = !!examinerUser;
          })
        );
        const status = checkNominationStatus(nomination);
        nomination.status = status;
        return Nominations.formatNominationData(nomination);
      })
    );

    return res.status(200).json(formattedNominations);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

function checkNominationStatus(nomination) {
  const allExaminersAssigned =
    nomination.internalExaminers.every(
      (examiner) => examiner.internalExaminersExist
    ) &&
    nomination.externalExaminers.every(
      (examiner) => examiner.externalExaminersExist
    );

  const studentAssignedToAllExaminers =
    nomination.internalExaminers.every(
      (examiner) =>
        examiner.internalExaminersExist &&
        Array.isArray(nomination.student.examiners) && // Check if it's an array
        nomination.student.examiners.includes(examiner.userId) &&
        examiner.examinees.includes(nomination.student.userId)
    ) &&
    nomination.externalExaminers.every(
      (examiner) =>
        examiner.externalExaminersExist &&
        Array.isArray(nomination.student.examiners) && // Check if it's an array
        examiner.examinees.includes(nomination.student.userId)
    );

  return allExaminersAssigned && studentAssignedToAllExaminers
    ? "done"
    : "pending";
}

module.exports = {
  createNomination,
  getNominationById,
  getAllNominations,
};
