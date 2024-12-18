const { firestore } = require("../../services/firebase");

class GFile {
  constructor({ originalName, autogeneratedName, userId, createdAt }) {
    this.originalName = originalName;
    this.autogeneratedName = autogeneratedName;
    this.userId = userId;
    this.createdAt = createdAt;
  }

  static async saveGFile(gFileData, collectionName) {
    try {
      const gFilesCollection = firestore().collection(collectionName);
      const savedFiles = [];

      // Loop through each gFileData item and save it individually
      for (const gData of gFileData) {
        const { userId, originalName, autogeneratedName, createdAt } = gData;

        const newGFile = {
          originalName,
          autogeneratedName,
          userId,
          createdAt,
        };

        const docRef = await gFilesCollection.add(newGFile);
        const savedFile = { ...newGFile, id: docRef.id };
        savedFiles.push(savedFile);
      }

      return savedFiles;
    } catch (error) {
      throw error;
    }
  }

  // fetch files based on the collection name in an arra
  static async fetchGFiles(collectionName) {
    try {
      const gFilesCollection = firestore().collection(collectionName);
      const snapshot = await gFilesCollection
        .orderBy("createdAt", "desc")
        .get();
      const gFiles = [];

      snapshot.forEach((doc) => {
        const gFile = doc.data();
        gFile.id = doc.id;
        gFiles.push(gFile);
      });

      return gFiles;
    } catch (error) {
      throw error;
    }
  }

  static async deleteGFile(collectionName, fileId) {
    try {
      const fileSubmissionsRef = firestore().collection(collectionName);
      const querySnapshot = await fileSubmissionsRef
        .where(firestore.FieldPath.documentId(), "==", fileId)
        .get();

      if (querySnapshot.empty) {
        return null;
      }

      const fileSubmissionDoc = querySnapshot.docs[0];
      await fileSubmissionDoc.ref.delete();
      return { message: "File deleted successfully" };
    } catch (error) {
      throw error;
    }
  }

  static async deleteGFileByAutogeneratedName(
    collectionName,
    autogeneratedName
  ) {
    try {
      const fileSubmissionsRef = firestore().collection(collectionName);
      const querySnapshot = await fileSubmissionsRef
        .where("autogeneratedName", "==", autogeneratedName)
        .get();

      if (querySnapshot.empty) {
        return null;
      }

      const fileSubmissionDoc = querySnapshot.docs[0];
      await fileSubmissionDoc.ref.delete();
      return { message: "File deleted successfully" };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = GFile;
