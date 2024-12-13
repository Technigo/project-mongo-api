import { World } from "../models/world.model.js";
import { Character } from "../models/character.model.js";
import { Quest } from "../models/quest.model.js";
import { Item } from "../models/item.model.js";
import data from "../data/fantasy-data.json";

export const seedDatabase = async () => {
  try {
    // Delete existing data
    await World.deleteMany();
    await Character.deleteMany();
    await Quest.deleteMany();
    await Item.deleteMany();

    // Insert worlds and create mapping
    const insertedWorlds = await World.insertMany(data.worlds);
    const worldMap = insertedWorlds.reduce((map, world) => {
      map[world.name] = world._id;
      return map;
    }, {});

    // Insert characters and create mapping
    const characters = data.characters.map((char) => ({
      ...char,
      homeWorld: worldMap[char.homeWorld],
    }));
    const insertedCharacters = await Character.insertMany(characters);
    const characterMap = insertedCharacters.reduce((map, char) => {
      map[char.name] = char._id;
      return map;
    }, {});

    // Insert items and update characters with item references
    const items = data.items.map((item) => ({
      ...item,
      owner: characterMap[item.owner],
    }));
    const insertedItems = await Item.insertMany(items);
    insertedItems.forEach((item) => {
      const character = insertedCharacters.find((char) =>
        char._id.equals(item.owner)
      );
      if (character) {
        character.item = item._id;
      }
    });
    await Promise.all(insertedCharacters.map((char) => char.save()));

    // Insert quests and update characters with quest references
    const quests = data.quests.map((quest) => ({
      ...quest,
      assignedTo: quest.assignedTo.map((name) => characterMap[name]),
    }));
    const insertedQuests = await Quest.insertMany(quests);
    insertedQuests.forEach((quest) => {
      quest.assignedTo.forEach((charId) => {
        const character = insertedCharacters.find((char) =>
          char._id.equals(charId)
        );
        if (character) {
          character.quests.push(quest._id);
        }
      });
    });
    await Promise.all(insertedCharacters.map((char) => char.save()));

    console.log("Database seeded successfully!");
  } catch (error) {
    console.error("Error seeding the database:", error);
  }
};
