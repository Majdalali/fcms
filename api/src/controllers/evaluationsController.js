// Secrets
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
const secretKey = process.env.SECRET_TOKEN;
const { firestore } = require("../services/firebase");

// Models

const meccEvalSVModel = require("../models/evaluationsModels/meccEvalSVModel");
const meccEvalEXModel = require("../models/evaluationsModels/meccEvalEXModel");
const mcsdEvalEXModel = require("../models/evaluationsModels/mcsdEvalEXModel");
const mcsdEvalSVModel = require("../models/evaluationsModels/mcsdEvalSVModel");

// Functions

// MECC Evaluations
async function createSVEvaluationMECC(req, res) {
  const token = req.headers.authorization;

  try {
    const decoded = jwt.verify(token, secretKey);
    const evaluatorId = decoded.user_id;
    const { studentId, pmpone, pmptwo, pp, aor, pic, ps, remarksForCord } =
      req.body;
    const finalMark =
      parseInt(pmpone) +
      parseInt(pmptwo) +
      parseInt(pp) +
      parseInt(aor) +
      parseInt(pic) +
      parseInt(ps);
    const evaluationData = {
      evaluatorId: evaluatorId,
      studentId,
      pmpone,
      pmptwo,
      pp,
      aor,
      pic,
      ps,
      finalMark,
      remarksForCord,
      createdAt: new Date(),
    };

    const newEvaluation = new meccEvalSVModel(evaluationData);
    await newEvaluation.save();

    return res.status(201).json({
      message: "MECC Evaluation created successfully",
      evaluationId: newEvaluation.evaluationId,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

async function createEXEvaluationMECC(req, res) {
  const token = req.headers.authorization;

  try {
    const decoded = jwt.verify(token, secretKey);
    const evaluatorId = decoded.user_id;
    const { studentId, aor, presentationMark, remarksForCord } = req.body;
    const finalMark = parseInt(aor) + parseInt(presentationMark);
    const evaluationData = {
      evaluatorId: evaluatorId,
      studentId,
      aor,
      presentationMark,
      finalMark,
      remarksForCord,
      createdAt: new Date(),
    };

    const newEvaluation = new meccEvalEXModel(evaluationData);
    await newEvaluation.save();

    return res.status(201).json({
      message: "MECC Evaluation created successfully",
      evaluationId: newEvaluation.evaluationId,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

// MCSD Evaluations
async function createSVEvaluationMCSD(req, res) {
  const token = req.headers.authorization;

  try {
    const decoded = jwt.verify(token, secretKey);
    const evaluatorId = decoded.user_id;
    const { studentId, pmp, pp, aor, pfpd, pac, remarksForCord } = req.body;
    const finalMark =
      parseInt(pmp) +
      parseInt(pp) +
      parseInt(aor) +
      parseInt(pfpd) +
      parseInt(pac);

    const evaluationData = {
      evaluatorId: evaluatorId,
      studentId,
      pmp,
      pp,
      aor,
      pfpd,
      pac,
      finalMark,
      remarksForCord,
      createdAt: new Date(),
    };

    const newEvaluation = new mcsdEvalSVModel(evaluationData);
    await newEvaluation.save();

    return res.status(201).json({
      message: "MCSD Evaluation created successfully",
      evaluationId: newEvaluation.evaluationId,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

async function createEXEvaluationMCSD(req, res) {
  const token = req.headers.authorization;

  try {
    const decoded = jwt.verify(token, secretKey);
    const evaluatorId = decoded.user_id;
    const { studentId, aor, pfpd, remarksForCord } = req.body;
    const finalMark = parseInt(aor) + parseInt(pfpd);
    const evaluationData = {
      evaluatorId: evaluatorId,
      studentId,
      aor,
      pfpd,
      finalMark,
      remarksForCord,
      createdAt: new Date(),
    };

    const newEvaluation = new mcsdEvalEXModel(evaluationData);
    await newEvaluation.save();

    return res.status(201).json({
      message: "MCSD Evaluation created successfully",
      evaluationId: newEvaluation.evaluationId,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

async function getEvaluationsById(req, res) {
  const { id } = req.params;

  const meccEvaluationsCollection = firestore().collection("meccEvaluations");

  try {
    const querySnapshot = await meccEvaluationsCollection
      .where("studentId", "==", id)
      .get();

    if (querySnapshot.empty) {
      const evaluatorSnapshot = await meccEvaluationsCollection
        .where("evaluatorId", "==", id)
        .get();

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

// Exports

module.exports = {
  createSVEvaluationMECC,
  createEXEvaluationMECC,
  createSVEvaluationMCSD,
  createEXEvaluationMCSD,
  getEvaluationsById,
};
