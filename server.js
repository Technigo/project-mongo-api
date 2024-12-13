import { app } from "./app.js";
import { connectDatabase } from "./config/database.js";
import { seedDatabase } from "./utils/seedDatabase.js";
import { configDotenv } from "dotenv";

// Load environment variables
configDotenv();

// Connect to the database and optionally seed it
(async () => {
  try {
    await connectDatabase();

    if (process.env.SEED_DATABASE === "true") {
      console.log("Seeding database...");
      await seedDatabase();
      console.log("Database seeding completed");
    }
  } catch (error) {
    console.error("Error connecting to the database or seeding:", error);
    process.exit(1);
  }
})();

// Export the app
export default app;
