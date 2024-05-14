import dotenv from "dotenv";
import Book from "./models/Book.js";
import { readFile } from "fs/promises";

dotenv.config();

const seedDatabase = async () => {
  try {
    const booksData = JSON.parse(
      await readFile(new URL("./data/books.json", import.meta.url))
    );
    await Book.deleteMany({});
    const bookPromises = booksData.map((book) => new Book(book).save());
    await Promise.all(bookPromises);
    console.log("Database seeded!");
  } catch (error) {
    console.error(`Error seeding database: ${error}`);
  }
};

export default seedDatabase;
