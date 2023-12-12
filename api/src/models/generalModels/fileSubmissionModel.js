const { firestore } = require("../../services/firebase");
class DataSubmission {
  constructor({
    submissionType,
    originalName,
    autogeneratedName,
    createdAt,
    studentId,
  }) {
    this.submissionType = submissionType;
    this.originalName = originalName;
    this.autogeneratedName = autogeneratedName;
    this.studentId = studentId;
    this.createdAt = createdAt;
  }

  static async saveDataSubmission(submissionType, fileSubmissionData) {
    try {
      const dataSubmissionCollection = firestore().collection(submissionType);

      // Loop through each fileSubmissionData item and save it individually
      for (const fileData of fileSubmissionData) {
        const { studentId, originalName, autogeneratedName, createdAt } =
          fileData;

        // Add your validation logic here, checking if required properties exist and are valid

        const newDataSubmission = {
          submissionType,
          originalName,
          autogeneratedName,
          studentId,
          createdAt,
        };

        await dataSubmissionCollection.add(newDataSubmission);
      }

      return { message: "Files info uploaded successfully" };
    } catch (error) {
      throw error;
    }
  }

  static async checkExistingSubmission(submissionType, studentId) {
    try {
      const submissionRef = firestore().collection(submissionType);
      const querySnapshot = await submissionRef
        .where("studentId", "==", studentId)
        .get();

      return !querySnapshot.empty;
    } catch (error) {
      throw error;
    }
  }
  static async getFileSubmissionsByStudentId(submissionType, studentId) {
    try {
      const fileSubmissionsRef = firestore().collection(submissionType);
      const querySnapshot = await fileSubmissionsRef
        .where("studentId", "==", studentId)
        .get();

      const fileSubmissions = [];
      querySnapshot.forEach((doc) => {
        const fileSubmissionData = doc.data();
        const fileSubmission = new DataSubmission({
          originalName: fileSubmissionData.originalName,
          autogeneratedName: fileSubmissionData.autogeneratedName,
          studentId: fileSubmissionData.studentId,
        });
        fileSubmissions.push(fileSubmission);
      });
      if (fileSubmissions.length === 0) {
        return `${studentId}: No recorded files`;
      }
      return fileSubmissions;
    } catch (error) {
      throw error;
    }
  }

  // static async getFileSubmissionById(submissionType, studentId) {
  //   try {
  //     const fileSubmissionsRef = firestore().collection(submissionType);
  //     const querySnapshot = await fileSubmissionsRef
  //       .where("studentId", "==", studentId)
  //       .get();

  //     if (querySnapshot.empty) {
  //       return null;
  //     }

  //     const fileSubmissionData = querySnapshot.docs[0].data();
  //     return new FileSubmission({
  //       originalName: fileSubmissionData.originalName,
  //       autogeneratedName: fileSubmissionData.autogeneratedName,
  //       studentId: fileSubmissionData.studentId,
  //       createdAt: fileSubmissionData.createdAt.toDate(),
  //     });
  //   } catch (error) {
  //     throw error;
  //   }
  // }
}

module.exports = DataSubmission;
