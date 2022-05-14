import MissionSchema from "../models/mission";

const allMissions = async (req, res) => {
  const limit = parseInt(req.query.limit);
  const offset = parseInt(req.query.skip);

  const missions = await MissionSchema.find().skip(offset).limit(limit);

  res.status(200).json({
    success: true,
    missions: missions
  });

};

module.exports = {
  allMissions
};
