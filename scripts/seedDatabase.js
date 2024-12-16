/** 
 * Seed the database with data from elves.json
 */

import mongoose from "mongoose";
import elves from "../data/elves.json";
// TODO: Import Elf model here when it's created

if (process.env.RESET_DB) {
   const seedDatabase = async () => {
     console.log("Starting to seed the database...");
     await Elf.deleteMany({});
     console.log("Old data deleted!");

     await Promise.all(
       elves.map(async (elfData) => {
         const elf = new Elf(elfData);
         await elf.save();
         console.log(`Saved elf: ${JSON.stringify(elf)}`);
       })
     );

     console.log("Database has been seeded!");
   };
   seedDatabase();
 }