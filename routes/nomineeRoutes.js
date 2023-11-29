import express from "express";
import { NomineeModel } from "../models/Nominee";
import listEndpoints from "express-list-endpoints";

const router = express.Router();

router.get("/", (req, res) => {
    res.send(listEndpoints(router));
});

router.get("/nominees", async (req, res) => {
    await NomineeModel.find()
        .then((nominees) => {
            if (nominees.length > 0) {
                res.json(nominees);
            } else {
                res.status(404).json({ error: "No movies found" });
            }
        })
        .catch((error) => {
            res.status(500).json({ error: "Something went wrong" });
        });
});

router.get("/nominees/:id", async (req, res) => {
    const nomineeId = req.params.id;
    await NomineeModel.findOne({ _id: nomineeId })
        .then((nominee) => {
            if (nominee) {
                res.json(nominee);
            } else {
                res.status(404).json({ error: "Nominee not found" });
            }
        })
        .catch((error) => {
            res.status(500).json({ error: "Something went wrong" });
        });
});

router.post("/add", async (req, res) => {
    const nominee = req.body;
    await NomineeModel.create( nominee )
        .then((result) => res.json(result))
        .catch((error) => res.json(error));
});

router.put("/update/:id", async (req, res) => {
    const { id } = req.params;
    const nominee = req.body;
    console.log(id);

    await NomineeModel.findByIdAndUpdate({ _id: id }, nominee )
        .then((result) => res.json(result))
        .catch((error) => res.json(error));
});

router.delete("/delete/:id", async (req, res) => {
    const { id } = req.params;

    await NomineeModel.findByIdAndDelete(id)
    .then((result) => {
        if (result) {
            res.json({
                message: "Nominee was deleted successfully",
                deletedNominee: result,
            });
        } else {
            res.status(404).json({ message: "Nominee not found"})
        }
    })
    .catch((error) => res.status(500).json(error))
})

module.exports = router;



