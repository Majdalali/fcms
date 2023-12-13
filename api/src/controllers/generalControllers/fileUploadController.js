const FileSubmission = require("../../models/generalModels/fileSubmissionModel");
const Lecturer = require("../../models/usersModels/lecturerModel");

const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const multer = require("multer");
const path = require("path");
const fs = require("fs/promises");

let randomFileName;

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    const randomString = crypto.randomBytes(10).toString("hex");
    const fileExtension = path.extname(file.originalname);
    randomFileName = randomString + fileExtension; // Assign the generated name to the variable
    cb(null, randomFileName);
  },
});

const upload = multer({ storage: storage });

async function uploadFile(req, res) {
  const token = req.headers.authorization;
  const { submissionType } = req.body; // Extract submissionType from req.body

  try {
    const decoded = jwt.verify(token, process.env.SECRET_TOKEN);
    const studentId = decoded.user_id;
    const allowedSubmissionTypes = [
      "proposals",
      "progressOne",
      "progressTwo",
      "finalSubmission",
      "corrections",
      "presentationAndDemos",
      "finalReport",
      "others",
    ];

    // Check if the provided submissionType is in the allowed types array
    if (!allowedSubmissionTypes.includes(submissionType)) {
      return res.status(400).json({ error: "Invalid submission type" });
    }

    let files = req.files; // Extract uploaded files

    // Save file info to the specified collection based on submissionType
    let fileSubmissionData;

    if (Array.isArray(files)) {
      // Handle multiple files for "others" submissionType
      fileSubmissionData = files.map((file) => ({
        originalName: file.originalname,
        autogeneratedName: file.filename,
        studentId,
        createdAt: new Date(),
        submissionType, // Include submissionType in the data
      }));
    } else {
      // Handle single file for other submissionTypes
      fileSubmissionData = [
        {
          originalName: files.originalname,
          autogeneratedName: files.filename,
          studentId,
          createdAt: new Date(),
          submissionType, // Include submissionType in the data
        },
      ];
    }

    // Call the saveDataSubmission function from your model with submissionType and fileSubmissionData
    await FileSubmission.saveDataSubmission(submissionType, fileSubmissionData);

    return res
      .status(200)
      .json({ message: "File info uploaded successfully", fileSubmissionData });
  } catch (error) {
    console.error(error);
    return res.status(401).json({ error: "Unauthorized" });
  }
}

async function checkExistingSubmission(req, res) {
  const token = req.headers.authorization;
  const { submissionType } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.SECRET_TOKEN);
    const studentId = decoded.user_id;

    if (submissionType == "others") {
      // For submission types "others", skip the existingSubmission check
      return res
        .status(200)
        .json({ message: "No existing submission check required" });
    }

    const existingSubmission = await FileSubmission.checkExistingSubmission(
      submissionType,
      studentId
    );

    if (existingSubmission) {
      return res.status(400).json({
        message: "Submission already exists for this student and type",
      });
    }

    return res.status(200).json({ message: "No existing submission found" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

async function displayFile(req, res) {
  const { fileName } = req.params;
  const filePath = path.join("./uploads", fileName);

  try {
    // Read the file asynchronously
    const fileData = await fs.readFile(filePath);

    // Send the file data in the response
    res.end(fileData);
  } catch (error) {
    console.error(error);
    return res.status(404).json({ error: "File not found" });
  }
}

async function getStudentFiles(req, res) {
  const token = req.headers.authorization;
  const { submissionType } = req.query;
  try {
    const decoded = jwt.verify(token, process.env.SECRET_TOKEN);
    const studentId = decoded.user_id;
    const studentFiles = await FileSubmission.getFileSubmissionsByStudentId(
      submissionType,
      studentId
    );

    if (studentFiles.error) {
      return res.status(400).json({ error: studentFiles.error });
    }

    return res.status(200).json(studentFiles);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

async function deleteFileByFileName(req, res) {
  const token = req.headers.authorization;
  const { fileName } = req.params;
  const { submissionType } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.SECRET_TOKEN);
    const studentId = decoded.user_id;

    const deleteResult = await FileSubmission.deleteFileByName(
      submissionType,
      studentId,
      fileName
    );

    if (!deleteResult) {
      return res.status(404).json({ error: "File not found" });
    }

    // Delete the file from the uploads folder
    const filePath = path.join("./uploads", fileName);
    await fs.unlink(filePath);

    return res.status(200).json(deleteResult);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

async function getSupervisorFiles(req, res) {
  const token = req.headers.authorization;

  try {
    const decoded = jwt.verify(token, process.env.SECRET_TOKEN);
    const userId = decoded.user_id;
    const user = await Lecturer.getUserById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const userSupervisedStudents = user.supervisedStudents;

    // Fetch files for each supervised student
    const filesPromises = userSupervisedStudents.map(async (studentId) => {
      try {
        // Fetch files for the current student using their userId (not user_id)
        const studentFiles = await FileSubmission.getFileSubmissionsByStudentId(
          studentId
        );
        return studentFiles;
      } catch (error) {
        console.error(error);
        return null;
      }
    });

    // Wait for all promises to resolve
    const files = await Promise.all(filesPromises);

    // Filter out null values (errors in fetching files)
    const validFiles = files.filter((file) => file !== null);

    return res.status(200).json(validFiles);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

module.exports = {
  uploadFile,
  upload,
  checkExistingSubmission,
  getStudentFiles,
  displayFile,
  deleteFileByFileName,
  getSupervisorFiles,
};
