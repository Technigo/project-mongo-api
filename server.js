import { app } from "./app.js";
import { connectDatabase } from "./config/database.js";
import { seedDatabase } from "./utils/seedDatabase.js";
import { configDotenv } from "dotenv";

// Load environment variables
configDotenv();

// Set the port
const port = process.env.PORT || 8080;

const startServer = async () => {
  try {
    // Connect to the database
    await connectDatabase();

    // Seed the database if the environment variable is set
    if (process.env.SEED_DATABASE === "true") {
      console.log("Seeding database...");
      await seedDatabase();
      console.log("Database seeding completed");
    }

    // Start the server
    app.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
    });
  } catch (error) {
    console.error("Error starting the server:", error);
    process.exit(1); // Exit the process with failure
  }
};

startServer();
