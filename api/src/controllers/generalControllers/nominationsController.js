const express = require("express");
const router = express.Router();
const {
  Nominations,
  CoSupervisor,
  Student,
  ExternalExaminer,
  InternalExaminer,
} = require("../../models/generalModels/nominationsModel");

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

module.exports = {
  createNomination,
  getNominationById,
};
