const Session = require("../../models/generalModels/sessionModel");

async function createSession(req, res) {
  const {
    session_id,
    session_title,
    presentationAndDemo,
    session_semester,
    progress_one,
    progress_two,
    finalSubmission,
    proposal,
    correction,
  } = req.body;

  const session = new Session({
    session_id,
    session_title,
    session_semester,
    presentationAndDemo,
    progress_one,
    progress_two,
    finalSubmission,
    proposal,
    correction,
    createdAt: new Date(),
  });

  try {
    await session.save();
    res.status(200).json({ message: "Session created successfully", session });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
}

async function getLatestSession(req, res) {
  try {
    const latestSession = await Session.getLatestSession();
    if (!latestSession) {
      return res.status(404).json({ error: "Latest session not found" });
    }
    res.status(200).json(latestSession);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
}

async function deleteSession(req, res) {
  const { sessionId } = req.params;

  try {
    const session = await Session.getSessionById(sessionId);

    if (!session) {
      return res.status(404).json({ error: "Session not found" });
    }

    await Session.deleteSession(sessionId);
    res.status(200).json({ message: "Session deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
}

// async function checkDeadline(req, res) {
//   const { submissionType } = req.body;
//   // Map submission types to corresponding session types
//   const typeMapping = {
//     proposals: "proposal",
//     progressOne: "progress_one",
//     progressTwo: "progress_two",
//     corrections: "correction",
//     presentationAndDemos: "presentationAndDemo",
//     finalSubmission: "finalSubmission",
//     proposalsExtras: "proposal",
//     progressOneExtras: "progress_one",
//     progressTwoExtras: "progress_two",
//     finalSubmissionExtras: "finalSubmission",
//     correctionsExtras: "correction",
//     presentationAndDemosExtras: "presentationAndDemo",
//   };

//   try {
//     // Retrieve the session based on session_program
//     const session = await Session.getLatestSession();

//     if (!session) {
//       return res.status(404).json({ error: "Session not found" });
//     }

//     // Check if sessionType is a valid property in the session
//     const sessionType = typeMapping[submissionType];
//     if (!Object.keys(session).includes(sessionType)) {
//       return res.status(400).json({ error: "Invalid submission type" });
//     }

//     // Check bypass_deadline
//     if (session.bypass_deadline === true) {
//       return res.status(200).json({ isWithinDeadline: true });
//     }

//     const { startDate, endDate } = session[sessionType];

//     // Parse date strings into Date objects
//     const jsStartDate = new Date(startDate);
//     const jsEndDate = new Date(endDate);

//     // Get the current time
//     const currentTime = Date.now();

//     // Check if the current time is within the deadline range
//     const isWithinDeadline =
//       currentTime >= jsStartDate.getTime() &&
//       currentTime <= jsEndDate.getTime();

//     res.status(200).json({ isWithinDeadline });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// }

async function checkDeadline(submissionType) {
  // Map submission types to corresponding session types
  const typeMapping = {
    proposals: "proposal",
    progressOne: "progress_one",
    progressTwo: "progress_two",
    corrections: "correction",
    presentationAndDemos: "presentationAndDemo",
    finalSubmission: "finalSubmission",
    proposalsExtras: "proposal",
    progressOneExtras: "progress_one",
    progressTwoExtras: "progress_two",
    finalSubmissionExtras: "finalSubmission",
    correctionsExtras: "correction",
    presentationAndDemosExtras: "presentationAndDemo",
  };

  try {
    // Retrieve the session based on session_program
    const session = await Session.getLatestSession();

    if (!session) {
      return { error: "Session not found" };
    }

    // Check if sessionType is a valid property in the session
    const sessionType = typeMapping[submissionType];
    if (!Object.keys(session).includes(sessionType)) {
      return { error: "Invalid submission type" };
    }

    // Check bypass_deadline
    if (session.bypass_deadline === true) {
      return { isWithinDeadline: true };
    }

    const { startDate, endDate } = session[sessionType];

    // Parse date strings into Date objects
    const jsStartDate = new Date(startDate);
    const jsEndDate = new Date(endDate);

    // Get the current time
    const currentTime = Date.now();

    // Check if the current time is within the deadline range
    const isWithinDeadline =
      currentTime >= jsStartDate.getTime() &&
      currentTime <= jsEndDate.getTime();

    return { isWithinDeadline };
  } catch (error) {
    console.error(error);
    return { error: "Internal server error" };
  }
}

async function getAllSessions(req, res) {
  try {
    const sessions = await Session.getAllSessions();
    if (sessions.length === 0) {
      return res.status(404).json({ error: "No sessions found" });
    }
    res.status(200).json(sessions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
}

async function updateSessionBypass(req, res) {
  const { sessionId } = req.params;
  const { bypass_deadline } = req.body;

  try {
    const session = await Session.getSessionById(sessionId);
    if (!session) {
      return res.status(404).json({ error: "Session not found" });
    }
    // check if bypass_deadline is a boolean
    if (typeof bypass_deadline !== "boolean") {
      return res.status(400).json({ error: "Invalid bypass_deadline value" });
    }
    await Session.updateSessionBypass(sessionId, bypass_deadline);

    res.status(200).json({ message: "Session bypass updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
}

module.exports = {
  createSession,
  deleteSession,
  getLatestSession,
  checkDeadline,
  getAllSessions,
  updateSessionBypass,
};
