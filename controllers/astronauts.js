import AstronautSchema from "../models/astronaut";

const allAstronauts = async (req, res) => {
  const limit = parseInt(req.query.limit) || 52;
  const offset = parseInt(req.query.skip) || 0;
  let { status, missions } = req.query;

  const MissionsNoSpecialCharacters = missions?.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');

  try {
    const filteredAstronauts = await AstronautSchema.find({
      status: new RegExp(status, "i"),
      missions: new RegExp(MissionsNoSpecialCharacters, "i")
    }).skip(offset).limit(limit)

    res.status(200).json({
      success: true,
      astronauts: filteredAstronauts
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      status_code: 400,
      status_message: "Bad request"
    });
  };
};

const astronautByName = async (req, res) => {
  const { name } = req.params;

  const specificAstronaut = await AstronautSchema.findOne({ name: name });

  if (specificAstronaut) {
    res.status(200).json({
      success: true,
      astronaut: specificAstronaut
    });
  } else {
    res.status(404).json({
      success: false,
      status_code: 404,
      status_message: `Astronaut with the name of ${name} can't be found`
    });
  };
};

module.exports = {
  allAstronauts,
  astronautByName
};
