import { Router } from "express";
import {
  getRestaurants,
  getRestaurant,
  setRestaurant,
  updateRestaurant,
  deleteRestaurant,
} from "../controllers/restaurantController";

const router = Router();

router.get("/", getRestaurants);
router.get("/:id", getRestaurant);
router.post("/", setRestaurant);
router.put("/:id", updateRestaurant);
router.delete("/:id", deleteRestaurant);

// ALT 2 - cleaner
// router.route("/").get(getGoals).post(setGoal);
// router.route("/:id").delete(deleteGoal).put(updateGoal);

export default router;
