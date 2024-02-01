// const jwt = require("jsonwebtoken");
// const dotenv = require("dotenv");
// dotenv.config();
// const secretKey = process.env.SECRET_TOKEN;

const Criteria = require("../../models/evaluationsModels/criteriaModel");

// Create a new criteria
async function createCriteria(req, res) {
  try {
    const { criteriaName, criteriasObjects, criteriaProgram } = req.body;

    let criteriaTotalMark = 0;
    for (const criterion in criteriasObjects) {
      criteriaTotalMark += parseFloat(criteriasObjects[criterion]);
    }

    const criteria = new Criteria({
      criteriaName,
      criteriasObjects,
      criteriaProgram,
      criteriaTotalMark,
    });

    await criteria.save();

    return res.status(200).json({
      message: `Criteria created successfully`,
      criteria,
    });
  } catch (error) {
    if (error.message === "Criteria for this program already exists") {
      return res.status(404).json({ error: error.message });
    }

    console.error("Error creating criteria:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

// Get Criteria by program

async function getCriteriaByProgram(req, res) {
  try {
    const { program } = req.params;

    const criteria = await Criteria.getCriteriaByProgram(program);

    if (!criteria) {
      return res
        .status(404)
        .json({ message: `No criteria found for program ${program}` });
    }

    return res.status(200).json(criteria);
  } catch (error) {
    console.error("Error fetching criteria:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

// Delete criteria by program
async function deleteCriteriaByProgram(req, res) {
  try {
    const { program } = req.params;

    const criteria = await Criteria.getCriteriaByProgram(program);

    if (!criteria) {
      return res
        .status(404)
        .json({ message: `No criteria found for program ${program}` });
    }

    await Criteria.deleteCriteriaByProgram(program);

    return res.status(200).json({ message: `Criteria deleted successfully` });
  } catch (error) {
    console.error("Error deleting criteria:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

// Get all criteria

async function getAllCriteria(req, res) {
  try {
    const criteria = await Criteria.getAllCriteria();

    if (!criteria.length) {
      return res.status(404).json({ message: `No criteria found` });
    }

    return res.status(200).json(criteria);
  } catch (error) {
    console.error("Error fetching criteria:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

module.exports = {
  createCriteria,
  getCriteriaByProgram,
  deleteCriteriaByProgram,
  getAllCriteria,
};
