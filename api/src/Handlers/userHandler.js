const { firestore } = require("../services/firebase");
const userCollection = firestore().collection("users");

async function getUserById(userId) {
  try {
    const userDoc = await userCollection.doc(userId).get();
    if (!userDoc.exists) {
      return null;
    }
    return userDoc.data();
  } catch (error) {
    throw error;
  }
}

async function getAllUsers() {
  try {
    const users = [];
    const querySnapshot = await userCollection.get();
    querySnapshot.forEach((doc) => {
      users.push(doc.data());
    });
    return users;
  } catch (error) {
    throw error;
  }
}

async function getUserByEmail(email) {
  try {
    const querySnapshot = await userCollection
      .where("email", "==", email)
      .get();
    if (querySnapshot.empty) {
      return null;
    }
    return querySnapshot.docs[0].data();
  } catch (error) {
    throw error;
  }
}

async function getUserByEmailOrMatric(email, matricCard) {
  try {
    let query = null;

    if (email) {
      query = userCollection.where("email", "==", email);
    } else if (matricCard) {
      query = userCollection.where("matricCard", "==", matricCard);
    } else {
      // Handle the case when neither email nor matricCard is provided
      return null;
    }

    const querySnapshot = await query.get();
    if (querySnapshot.empty) {
      return null;
    }

    return querySnapshot.docs[0].data();
  } catch (error) {
    throw error;
  }
}

module.exports = {
  getUserById,
  getAllUsers,
  getUserByEmail,
  getUserByEmailOrMatric,
};
