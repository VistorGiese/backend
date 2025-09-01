import express from "express";
import {
  getAll,
  getUserById,
  CreateUser,
  updaterUser,
  DestroyUserById,
  listUsers,
} from "../controllers/UserController";
import { authMiddleware } from '../middleware/authmiddleware';

const router = express.Router();

router.post("/users", CreateUser);

router.get("/users/list", authMiddleware, listUsers);
router.get("/users", authMiddleware, getAll);
router.get("/users/:id", authMiddleware, getUserById);
router.put("/users/:id", authMiddleware, updaterUser);
router.delete("/users/:id", authMiddleware, DestroyUserById);

export default router;