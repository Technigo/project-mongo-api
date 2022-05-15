import dotenv from "dotenv";

import astronautsData from "./data/nasa-astronauts.json";
import missionsData from "./data/missions.json";

import AstronautSchema from "./models/astronaut";
import MissionSchema from "./models/mission";

dotenv.config();

if (process.env.RESET_DATABASE) {
  try {
    const seedDatabase = async () => {
      await AstronautSchema.deleteMany();
      await MissionSchema.deleteMany();

      astronautsData.forEach((astronaut) => {
        const newAstronaut = new AstronautSchema(astronaut);
        newAstronaut.save()
      });

      missionsData.forEach((mission) => {
        const newMission = new MissionSchema(mission);
        newMission.save()
      })
    };

    seedDatabase();
  } catch (error) {
    console.error(error)
  }
};