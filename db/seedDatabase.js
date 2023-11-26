// Import necessary modules and define the function to seed the database
import BirdFamily from '../models/birdFamilyModel.js';
import Bird from '../models/birdModel.js';
import birdData from '../data/birdData.json'; // Import the JSON file


const seedDatabase = async () => {
    await BirdFamily.deleteMany();
    await Bird.deleteMany();

    const birdFamilies = birdData.birdFamilies;
    const birds = birdData.birds;

    // Seed Bird Families
    await Promise.all(
        birdFamilies.map(async (familyData) => {
            const family = new BirdFamily(familyData);
            await family.save();
        })
    );

    // Seed Birds
    await Promise.all(
        birds.map(async (birdData) => {
            const family = await BirdFamily.findOne({ name: birdData.family });
            if (family) {
                birdData.family = family; // Set the family reference
                const bird = new Bird(birdData);
                await bird.save();
            }
        })
    );
};

export default seedDatabase;