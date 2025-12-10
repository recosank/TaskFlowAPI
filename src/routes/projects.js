import express from "express";
import { validateBody } from "../middleware/validateMiddleware.js";
import { requireAuth } from "../middleware/authMiddleware.js";
import {
  listProjects,
  createProject,
  getProject,
  updateProject,
  deleteProject,
} from "../controllers/projectsController.js";
import { projectSchema } from "../utils/schema.js";

const router = express.Router();

router.use(requireAuth);

router.get("/", listProjects);
router.post("/", validateBody(projectSchema), createProject);
router.get("/:id", getProject);
router.put("/:id", validateBody(projectSchema), updateProject);
router.delete("/:id", deleteProject);

export default router;
