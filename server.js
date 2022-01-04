import express from "express";
import cors from "cors";
import mongoose from "mongoose";

import f1Data from "./data/f1-2020-data.json";

// Defines the port the app will run on. Defaults to 8080, but can be
// overridden when starting the server. For example:
//
//   PORT=9000 npm start
const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

const User = mongoose.model("User", {
    name: String,
    age: Number,
});

if (process.env.RESET_DB) {
    const newUser = new User({ name: "Sarah", age: 37 });
    const newUser2 = new User({ name: "Steve", age: 38 });

    newUser.save();
    newUser2.save();
}

// Start defining your routes here
app.get("/", (req, res) => {
    User.find().then((users) => {
        res.json(users);
    });
});

app.get("/:name", (req, res) => {
    User.findOne({ name: req.params.name }).then((user) => {
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ error: "not found" });
        }
    });
});

// Start the server
app.listen(port, () => {
    // eslint-disable-next-line
    console.log(`Server running on http://localhost:${port}`);
});
