import { Router } from "express";
import {
  getRestaurants,
  setRestaurant,
  updateRestaurant,
  deleteRestaurant,
} from "../controllers/restaurantController";

const router = Router();

router.get("/", getRestaurants);
router.post("/", setRestaurant);
router.put("/:id", updateRestaurant);
router.delete("/:id", deleteRestaurant);

export default router;
