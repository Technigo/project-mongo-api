import MissionSchema from "../models/mission";

const allMissions = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit);
    const offset = parseInt(req.query.skip);

    const missions = await MissionSchema.find().skip(offset).limit(limit);

    res.status(200).json({
      success: true,
      missions: missions
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      status_code: 400,
      status_message: "Invalid request"
    });
  };
};

module.exports = {
  allMissions
};
