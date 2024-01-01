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
    res.status(200).json(session);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
}

async function getSession(req, res) {
  const { sessionTitle } = req.params;

  try {
    const session = await Session.getSession(sessionTitle);
    if (!session) {
      return res.status(404).json({ error: "Session not found" });
    }
    res.status(200).json(session);
  } catch (error) {
    console.error(error);
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
    await Session.deleteSession(sessionId);
    res.status(200).json({ message: "Session deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
}

module.exports = { createSession, getSession, deleteSession, getLatestSession };
