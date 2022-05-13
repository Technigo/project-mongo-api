import AstronautSchema from "../models/astronaut";

const allAstronauts = async (req, res) => {
  const { missions } = req.query;

  const allAstronauts = await AstronautSchema.find();

  if (missions) {
    const filteredAstronauts = allAstronauts.filter((astronaut) => astronaut.missions.includes(missions))
    res.status(200).json({
      success: true,
      results: filteredAstronauts
    })
  } else {
    res.status(200).json({
      success: true,
      results: allAstronauts
    })
  }
};

const astronautByName = async (req, res) => {
  const { name } = req.params;

  const specificAstronaut = await AstronautSchema.findOne({ name: name });

  if (specificAstronaut) {
    res.status(200).json({
      success: true,
      astronaut: specificAstronaut
    })
  } else {
    res.status(404).json({
      success: false,
      status_code: 404,
      status_message: `Astronaut with the name of ${name} can't be found`
    })
  }
}
 
module.exports = {
  allAstronauts,
  astronautByName
};
