import AstronautSchema from "../models/astronaut";

const allYears = async (req, res) => {
  const astronautsYears = await AstronautSchema.find();

  let allYears = [];

  astronautsYears.forEach((astronaut) => {
    if (astronaut.year !== null) {
      if (!allYears.includes(astronaut.year)) {
        allYears.push(astronaut.year);
      };
    }
  });

  const sortedYears = allYears.sort((firstYear, secondYear) => firstYear - secondYear);

  res.status(200).json({
    success: true,
    years: sortedYears,
  });
  
};

const astronautByYear = async (req, res) => {
  const limit = parseInt(req.query.limit);
  const skip = parseInt(req.query.skip);
  const { year } = req.params;

  const astronautYear = await AstronautSchema.find({ year: year }).skip(skip).limit(limit);

  res.status(200).json({
    success: true,
    astronauts: astronautYear
  });

};

module.exports = {
  allYears,
  astronautByYear
};
