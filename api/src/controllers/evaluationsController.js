// Secrets
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
const secretKey = process.env.SECRET_TOKEN;

// Models

const evaluationsModel = require("../models/evaluationsModels/evaluationsModel");
const studentModel = require("../models/usersModels/studentModel");
const lecturerModel = require("../models/usersModels/lecturerModel");

// Functions

async function getEvaluationsById(req, res) {
  const { id } = req.params;

  try {
    const evaluations = await evaluationsModel.getEvaluationsById(id);

    if (!evaluations.length) {
      return res
        .status(404)
        .json({ message: `No evaluations found for id ${id}` });
    }

    return res.status(200).json(evaluations);
  } catch (error) {
    console.error("Error getting evaluations by id:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

async function getAllEvaluations(req, res) {
  const token = req.headers.authorization;

  try {
    const evaluations = await evaluationsModel.getAllEvaluations();
    if (evaluations.length === 0) {
      return res.status(404).json({ message: "No evaluations found" });
    }

    return res.status(200).json(evaluations);
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
}

async function createANomination(req, res) {
  const token = req.headers.authorization;
  try {
    const decoded = jwt.verify(token, secretKey);
    const lecturerId = decoded.user_id;
    const lecturer = await lecturerModel.getUserById(lecturerId);
    const lecturerName = lecturer.username;

    const {
      studentId,
      evaluationObjects,
      remarksForCord,
      typeOfEvaluator,
      criteriaProgram,
    } = req.body;

    // Calculate the final mark based on the provided evaluation criteria
    let finalMark = {
      totalMarks: 0,
      totalOutOf: 0,
    };

    for (const criterion in evaluationObjects) {
      const { mark, outOf } = evaluationObjects[criterion];

      // Ensure mark and outOf are valid numbers
      const numericMark = parseFloat(mark);
      const numericOutOf = parseFloat(outOf);

      if (!isNaN(numericMark) && !isNaN(numericOutOf)) {
        // Add the mark to the total marks
        finalMark.totalMarks += numericMark;

        // Add the outOf to the total outOf
        finalMark.totalOutOf += numericOutOf;
      }
    }

    const student = await studentModel.getUserById(studentId);

    // Create the evaluation model instance
    const newEvaluation = new evaluationsModel({
      evaluatorId: lecturerId,
      studentId,
      evaluationObjects,
      remarksForCord,
      finalMark,
      typeOfEvaluator,
      createdAt: new Date(),
      lecturerName: lecturerName,
      studentName: student.username,
      criteriaProgram: criteriaProgram,
    });

    // Save the evaluation
    await newEvaluation.save();

    res.status(201).json({
      message: "Evaluation created successfully",
      evaluationId: newEvaluation.evaluationId,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

async function getLecturerEvaluations(req, res) {
  const token = req.headers.authorization;
  try {
    const decoded = jwt.verify(token, secretKey);
    const lecturerId = decoded.user_id;

    const evaluations = await evaluationsModel.getLecturerEvaluationsById(
      lecturerId
    );

    if (evaluations.length === 0) {
      return res.status(404).json({ message: "No evaluations found" });
    }

    return res.status(200).json(evaluations);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

// Exports

module.exports = {
  getAllEvaluations,
  getEvaluationsById,
  createANomination,
  getLecturerEvaluations,
};
