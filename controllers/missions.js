import MissionSchema from "../models/mission";

const allMissions = async (req, res) => {
  const { missions } = req.query;

  const astronautMissions = await MissionSchema.find();

  if (missions) {
    const filteredAstronauts = astronautMissions.filter((mission) => mission.missions.includes(missions))
    res.status(200).json({
      success: true,
      results: filteredAstronauts
    })
  } else {
    res.status(200).json({
      success: true,
      results: astronautMissions
    })
  }
};

const missionByName = async (req, res) => {
  const { name } = req.params;

  const specificMission = await MissionSchema.findOne({ name: name });

  if (name) {
    res.status(200).json({
      success: true,
      astronaut: specificMission
    })
  } else {
    res.status(404).json({
      success: false,
      status_code: 404,
      status_message: `Mission with the name of ${name} can't be found`
    })
  }
};

module.exports = {
  allMissions,
  missionByName
};
