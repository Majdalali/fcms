const { firestore } = require("../../services/firebase");

// Define an endpoint to archive all tables
async function archiveTables(req, res) {
  try {
    // Get all collections from Firestore
    const collections = await firestore().listCollections();

    // Archive data from each collection
    const archivePromises = collections.map((collection) => {
      const archiveBatch = firestore().batch();
      const archiveCollection = firestore().collection(
        `archived${collection.name}`
      );

      return collection.get().then((snapshot) => {
        snapshot.forEach((doc) => {
          // Copy the document to the archive collection
          archiveBatch.set(archiveCollection.doc(doc.id), doc.data());
          // Delete the document from the active collection
          archiveBatch.delete(doc.ref);
        });

        return archiveBatch.commit();
      });
    });

    // Wait for all archive operations to complete
    await Promise.all(archivePromises);

    res.status(200).json({ message: "All tables archived successfully." });
  } catch (error) {
    console.error("Error archiving tables:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

async function restoreArchivedTables(req, res) {
  try {
    // Get all collections from Firestore
    const collections = await firestore().listCollections();

    // Restore data from each archived collection
    const restorePromises = collections.map((collection) => {
      // Determine the corresponding archived collection
      const archiveCollectionName = collection.id.startsWith("archived")
        ? collection.id.slice(8)
        : null;
      if (!archiveCollectionName) {
        console.log(
          `Skipping collection ${collection.id}: Not an archived collection.`
        );
        return Promise.resolve();
      }

      const archiveCollection = firestore().collection(collection.id);
      const originalCollection = firestore().collection(
        archiveCollectionName.toLowerCase()
      );

      // Create a batch to restore documents
      const restoreBatch = firestore().batch();

      // Retrieve documents from the archived collection
      return archiveCollection.get().then((snapshot) => {
        snapshot.forEach((doc) => {
          // Copy the document to the original collection
          restoreBatch.set(originalCollection.doc(doc.id), doc.data());
          // Delete the document from the archived collection
          restoreBatch.delete(doc.ref);
        });

        // Commit the batch to restore documents and delete them from the archive
        return restoreBatch.commit();
      });
    });

    // Wait for all restore operations to complete
    await Promise.all(restorePromises);

    res.status(200).json({ message: "Archived data restored successfully." });
  } catch (error) {
    console.error("Error restoring archived data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

async function archiveProjectInfo(req, res) {
  try {
    // Get all documents from the "users" collection
    const usersCollection = firestore().collection("students");
    const usersSnapshot = await usersCollection.get();

    // Update the "projectInfo" field for each user
    const updatePromises = usersSnapshot.docs.map((userDoc) => {
      const userRef = usersCollection.doc(userDoc.id);
      const userData = userDoc.data();

      // Update the "projectInfo" field to an empty string or any desired value
      const updatedData = {
        ...userData,
        projectInfo: {},
      };

      return userRef.update(updatedData);
    });

    // Wait for all update operations to complete
    await Promise.all(updatePromises);

    res
      .status(200)
      .json({ message: "ProjectInfo field reset for all users successfully." });
  } catch (error) {
    console.error("Error resetting projectInfo field:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

async function archiveNotifications(req, res) {
  try {
    // Get the collection reference for "notifications"
    const notificationsCollection = firestore().collection("Notifications");

    // Get all documents from the "notifications" collection
    const notificationsSnapshot = await notificationsCollection.get();

    // Create an archive collection for "notifications" (e.g., "archivedNotifications")
    const archiveCollection = firestore().collection("archivedNotifications");

    // Archive the notifications data
    const archivePromises = notificationsSnapshot.docs.map(
      (notificationDoc) => {
        // Move each document to the archive collection
        return archiveCollection
          .doc(notificationDoc.id)
          .set(notificationDoc.data())
          .then(() => {
            // Delete the document from the active collection
            return notificationDoc.ref.delete();
          });
      }
    );

    // Wait for all archive and delete operations to complete
    await Promise.all(archivePromises);

    res
      .status(200)
      .json({ message: "Notifications table archived successfully." });
  } catch (error) {
    console.error("Error archiving notifications table:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

module.exports = {
  archiveTables,
  archiveProjectInfo,
  archiveNotifications,
  restoreArchivedTables,
};
