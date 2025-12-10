import express from "express";
import { validateBody } from "../middleware/validateMiddleware.js";
import { requireAuth } from "../middleware/authMiddleware.js";
import {
  listTasks,
  createTask,
  updateTask,
  deleteTask,
  getDashboardTasks,
  searchTasks,
} from "../controllers/tasksController.js";
import { taskSchema } from "../utils/schema.js";

const router = express.Router();

router.use(requireAuth);

router.get("/project/:projectId", listTasks);
router.get("/", searchTasks);
router.get("/dashboard", getDashboardTasks);
router.post("/", validateBody(taskSchema), createTask);
router.put("/:id", validateBody(taskSchema.partial()), updateTask);
router.delete("/:id", deleteTask);

export default router;
