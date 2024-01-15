const ProgramModel = require("../../models/usersModels/programModel");

async function createProgram(req, res) {
  try {
    const { programTypes } = req.body;

    const program = new ProgramModel({
      programTypes,
    });

    await program.save();

    return res.status(200).json({
      message: `Program created successfully`,
      programId: program.program_id,
    });
  } catch (error) {
    if (error.message === "Only one instance can exist") {
      return res.status(404).json({ error: error.message });
    }

    console.error("Error creating program:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

async function getPrograms(req, res) {
  try {
    const programs = await ProgramModel.getThePrograms();
    if (!programs) {
      return res.status(404).json({ error: "No programs found" });
    }
    return res.status(200).json({ programs });
  } catch (error) {
    console.error("Error getting programs:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

async function updateProgram(req, res) {
  try {
    const { programTypes } = req.body;
    const { programId } = req.params;
    const programs = new ProgramModel({
      program_id: programId,
      programTypes,
    });
    await programs.update();
    return res
      .status(200)
      .json({ message: "Program updated successfully", programs });
  } catch (error) {
    console.error("Error updating program:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

module.exports = {
  createProgram,
  getPrograms,
  updateProgram,
};
