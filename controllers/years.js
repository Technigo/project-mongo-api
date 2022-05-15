import AstronautSchema from "../models/astronaut";

const allYears = async (req, res) => {
  try {
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
  } catch (error) {
    res.status(400).json({
      success: false,
      status_code: 400,
      status_message: "Invalid request"
    });
  }; 
};

const astronautByYear = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit);
    const offset = parseInt(req.query.skip);
    const { year } = req.params;

    const astronautYear = await AstronautSchema.find({ year: year }).skip(offset).limit(limit);

    res.status(200).json({
      success: true,
      astronauts: astronautYear
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
  allYears,
  astronautByYear
};
