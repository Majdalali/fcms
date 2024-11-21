const ChairmanApp = require("../../models/evaluationsModels/chairmanApp");
// jwt and env
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
const secretKey = process.env.SECRET_TOKEN;

async function createChairmanApp(req, res) {
  try {
    const {
      chairmanAppStudentId,
      chairmanAppEvaluators,
      chairmanAppDecision,
      chairmanAppSupportingDocuments,
      chairmanId,
      studentName,
      matricNumber,
    } = req.body;

    // decode the token to get chairmanId

    const chairmanApp = new ChairmanApp({
      chairmanId,
      chairmanAppStudentId,
      chairmanAppEvaluators,
      chairmanAppDecision,
      chairmanAppSupportingDocuments,
      studentName,
      matricNumber,
      createdAt: new Date(),
    });

    await chairmanApp.save();

    return res.status(200).json({
      message: `Chairman Application created successfully`,
      chairmanApp,
    });
  } catch (error) {
    if (
      error.message === "Chairman Application for this student already exists"
    ) {
      return res.status(404).json({ error: error.message });
    }
    console.error("Error creating chairman application:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

async function getAllChairmanApps(req, res) {
  try {
    const chairmanApps = await ChairmanApp.getAllChairmanApps();
    if (!chairmanApps) {
      return res.status(404).json({ error: "No chairman applications found" });
    }

    return res.status(200).json(chairmanApps);
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
}

async function updateChairmanApp(req, res) {
  try {
    const {
      chairmanAppId,
      chairmanAppDecision,
      chairmanAppSupportingDocuments,
    } = req.body;

    const chairmanAppExists = await ChairmanApp.getAppByChairmanAppId(
      chairmanAppId
    );
    if (!chairmanAppExists) {
      return res.status(404).json({ error: "Chairman Application not found" });
    }
    let chairmanDocs = chairmanAppExists.chairmanAppSupportingDocuments;

    // Check if chairmanDocs array is not empty
    if (chairmanDocs.length > 0) {
      // Add new documents to the existing array
      chairmanAppSupportingDocuments.forEach((doc) => {
        chairmanDocs.push(doc);
      });
    } else {
      // If array is empty, assign the new documents directly
      chairmanDocs = chairmanAppSupportingDocuments;
    }
    let chairmanAD;
    if (chairmanAppDecision == "") {
      chairmanAD = chairmanAppExists.chairmanAppDecision;
    } else {
      chairmanAD = chairmanAppDecision;
    }

    const chairmanApp = new ChairmanApp({
      chairmanAppId,
      chairmanAppDecision: chairmanAD,
      chairmanAppSupportingDocuments: chairmanDocs,
    });

    await chairmanApp.update();

    return res.status(200).json({
      message: `Chairman Application updated successfully`,
    });
  } catch (error) {
    console.error("Error updating chairman application:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

async function getStudentApp(req, res) {
  try {
    // decode
    const token = req.headers.authorization;
    const decoded = jwt.verify(token, secretKey);
    const studentId = decoded.user_id;

    const studentApp = await ChairmanApp.getChairmanAppByStudentId(studentId);
    if (!studentApp) {
      return res.status(404).json({ error: "Chairman Application not found" });
    }
    let app = [studentApp];
    return res.status(200).json(app);
  } catch (error) {
    console.error("Error getting student chairman application:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

async function deleteSupportingDoc(req, res) {
  try {
    const { chairmanAppId, docId } = req.body;

    const chairmanAppExists = await ChairmanApp.getAppByChairmanAppId(
      chairmanAppId
    );
    if (!chairmanAppExists) {
      return res.status(404).json({ error: "Chairman Application not found" });
    }

    let chairmanDocs = chairmanAppExists.chairmanAppSupportingDocuments;

    // Check if chairmanDocs array is not empty
    if (chairmanDocs.length > 0) {
      // Remove the document from the array matchign the docId
      chairmanDocs = chairmanDocs.filter((doc) => doc !== docId);
    }

    const chairmanApp = new ChairmanApp({
      chairmanAppId,
      chairmanAppSupportingDocuments: chairmanDocs,
      chairmanAppDecision: chairmanAppExists.chairmanAppDecision,
    });

    await chairmanApp.update();

    return res.status(200).json({
      message: `Document deleted successfully`,
    });
  } catch (error) {
    console.error("Error deleting document:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
module.exports = {
  createChairmanApp,
  getAllChairmanApps,
  updateChairmanApp,
  getStudentApp,
  deleteSupportingDoc,
};
