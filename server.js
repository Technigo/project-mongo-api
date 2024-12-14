import { connectDatabase } from "./config/database.js";
import { seedDatabase } from "./utils/seedDatabase.js";
import { app } from "./app.js";

const port = process.env.PORT || 8070;

(async () => {
  try {
    // Connect to MongoDB
    await connectDatabase();

    // Check if RESET_DATABASE is set to trigger seeding
    if (process.env.RESET_DATABASE === "true") {
      console.log("RESET_DATABASE is set. Seeding the database...");
      await seedDatabase();
    } else {
      console.log("RESET_DATABASE is not set. Skipping database seeding.");
    }

    // Start server
    app.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1); // Exit the process on failure
  }
})();

// Simplify server.js to handle only the server initialization and database connection