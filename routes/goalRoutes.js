import { Router } from "express";
import { getGoals, setGoals, updateGoals, deleteGoal } from "../controllers/goalController";

const router = Router();
// ALT 1
// router.get("/", getGoals);
// router.post("/", setGoals);
// router.put("/:id", updateGoals);
// router.delete("/:id", deleteGoal);

// ALT 2 - cleaner
router.route("/").get(getGoals).post(setGoals);
router.route("/").delete(deleteGoal).put(updateGoals);

export default router;
