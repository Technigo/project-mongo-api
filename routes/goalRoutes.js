import { Router } from "express";
import { getGoals, setGoal, updateGoal, deleteGoal } from "../controllers/goalController";

const router = Router();

router.get("/", getGoals);
router.post("/", setGoal);
router.put("/:id", updateGoal);
router.delete("/:id", deleteGoal);

// ALT 2 - cleaner
// router.route("/").get(getGoals).post(setGoal);
// router.route("/:id").delete(deleteGoal).put(updateGoal);

export default router;
