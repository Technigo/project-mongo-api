import express from "express";
import cors from "cors";
import mongoose, { mongo } from "mongoose";
import members from "./data/technigo-members.json";
import roles from "./data/technigo-roles.json";

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

const memberSchema = new mongoose.Schema({
  name: String,
  surname: String,
  role: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Role",
  },
  lettersInName: Numbwer,
  isPapa: Boolean,
});

const Member = mongoose.model("Member", memberSchema);

const roleSchema = new mongoose.Schema({
  description: String,
});

const Role = mongoose.model("Role", roleSchema);

if (process.env.RESET_DB) {
  const seedDB = async () => {
    await Member.deleteMany();
    await Role.deleteMany();

    const rolesArray = [];

    roles.forEach(async (item) => {
      const role = new Role(item);
      rolesArray.push(role);
      await role.save();
    });

    members.forEach(async (item) => {
      const newMember = new Member({
        ...item,
        role: rolesArray.find(
          (singleRole) => singleRole.description === item.role
        ),
      });
      await newMember.save();
    });
  };
  seedDB();
}

const port = process.env.PORT || 8080;
const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello world");
});

app.get("/members", async (req, res) => {
  const { name } = req.query;

  if (name) {
    const members = await Member.find({
      name: {
        $regex: new RegExp(name, "i"),
      },
    });
    res.json(members);
  } else {
    const members = await Member.find();
    res.json(members);
  }

  //v2 - promise (classic)
  // Member.find().then(data => {
  //   res.json(data);
  // });

  // v3 - mongoose
  // Member.find((err, data) => {
  //   res.json(data);
  // })
});

app.get("/members/:memberId", async (req, res) => {
  // new version
  const { memberId } = req.params;
  // old version
  // const id = req.params.id;

  // const singleMember = await Member.findOne({ _id: memberId });
  const singleMember = await Member.findById(memberId);

  res.json(singleMember);
});

app.get("/members/name/:memberName", async (req, res) => {
  const { memberName } = req.params;

  //v1 - async/await
  try {
    const singleMember = await Member.findOne({ name: memberName });
    res.json(singleMember);
  } catch (error) {
    res.status(400).json({ error: "Something went wrong", details: error });
  }

  //v2 - classic .then()
  // Member.findOne({ name: memberName })
  // .then(data => res.json(data))
  // .catch(error => res.status(400).json({ error: 'Something went wrong', details: error }))
});

app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Server running on http://localhost:${port}`);
});
