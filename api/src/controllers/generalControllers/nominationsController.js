const express = require("express");
const router = express.Router();
const {
  Nominations,
  Examiner,
  CoSupervisor,
  Student,
} = require("../../models/generalModels/nominationsModel");

const jwt = require("jsonwebtoken");

// POST endpoint to create a new nomination entry
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

    // Create instances for related classes
    const coSupervisorsInstances = coSupervisors.map(
      (coSupervisor) => new CoSupervisor(coSupervisor)
    );

    const studentInstance = new Student(student);

    const internalExaminersInstances = internalExaminers.map(
      (examiner) => new Examiner(examiner)
    );
    const externalExaminersInstances = externalExaminers.map(
      (examiner) => new Examiner(examiner)
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
      .status(201)
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
