import MissionSchema from "../models/mission";

const allMissions = async (req, res) => {
  try {
    const missions = await MissionSchema.find();

    res.status(200).json({
      success: true,
      missions: missions
    });
  } catch (error) {
    console.log(error)
  }

};

module.exports = {
  allMissions
};
