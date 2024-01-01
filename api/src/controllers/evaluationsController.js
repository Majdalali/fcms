// Secrets
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
const secretKey = process.env.SECRET_TOKEN;
const { firestore } = require("../services/firebase");

// Models

const evaluationsModel = require("../models/evaluationsModels/evaluationsModel");

// Functions

async function getEvaluationsById(req, res) {
  const { id } = req.params;

  const EvaluationsCollection = firestore().collection("Evaluations");

  try {
    const querySnapshot = await EvaluationsCollection.where(
      "studentId",
      "==",
      id
    ).get();

    if (querySnapshot.empty) {
      const evaluatorSnapshot = await EvaluationsCollection.where(
        "evaluatorId",
        "==",
        id
      ).get();

      if (evaluatorSnapshot.empty) {
        return res
          .status(404)
          .json({ message: `No evaluations found for id ${id}` });
      }

      const evaluations = [];
      evaluatorSnapshot.forEach((doc) => {
        const data = doc.data();
        evaluations.push(data);
      });

      return res.status(200).json(evaluations);
    }

    const evaluations = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      evaluations.push(data);
    });

    return res.status(200).json(evaluations);
  } catch (error) {
    console.error("Error getting evaluations by id:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
async function getAllEvaluations(req, res) {
  const evaluationsCollection = firestore().collection("Evaluations");

  try {
    const querySnapshot = await evaluationsCollection.get();

    if (querySnapshot.empty) {
      return res.status(404).json({ message: `No evaluations found` });
    }

    const evaluations = querySnapshot.docs.map((doc) => doc.data());

    return res.status(200).json(evaluations);
  } catch (error) {
    console.error("Error getting evaluations:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

async function createANomination(req, res) {
  const token = req.headers.authorization;
  try {
    const decoded = jwt.verify(token, process.env.SECRET_TOKEN);
    const lecturerId = decoded.user_id;

    const { studentId, evaluationObjects, remarksForCord, typeOfEvaluator } =
      req.body;

    // Calculate the final mark based on the provided evaluation criteria
    let finalMark = 0;
    for (const criterion in evaluationObjects) {
      finalMark += parseFloat(evaluationObjects[criterion]);
    }

    // Create the evaluation model instance
    const newEvaluation = new evaluationsModel({
      evaluatorId: lecturerId,
      studentId,
      evaluationObjects,
      remarksForCord,
      finalMark,
      typeOfEvaluator,
      createdAt: new Date(),
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

// Exports

module.exports = {
  getAllEvaluations,
  getEvaluationsById,
  createANomination,
};
