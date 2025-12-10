import prisma from "../prismaClient.js";
import { HttpError } from "../utils/errorHandler.js";

export async function listProjects(req, res, next) {
  try {
    const userId = Number(req.user.id);
    const projects = await prisma.project.findMany({
      where: { ownerId: userId },
      include: { tasks: true },
      orderBy: { updatedAt: "desc" },
    });
    res.json(projects);
  } catch (err) {
    next(err);
  }
}

export async function createProject(req, res, next) {
  try {
    const userId = Number(req.user.id);
    const { title, description } = req.body;
    const project = await prisma.project.create({
      data: { ownerId: userId, title, description },
    });
    res.status(201).json(project);
  } catch (err) {
    next(err);
  }
}

export async function getProject(req, res, next) {
  try {
    const id = Number(req.params.id);
    const project = await prisma.project.findUnique({
      where: { id },
      include: { tasks: true },
    });
    if (!project) throw new HttpError(404, "project not found");
    if (project.ownerId !== Number(req.user.id))
      throw new HttpError(403, "Forbidden");
    res.json(project);
  } catch (err) {
    next(err);
  }
}

export async function updateProject(req, res, next) {
  try {
    const id = Number(req.params.id);
    const existing = await prisma.project.findUnique({ where: { id } });
    if (!existing) throw new HttpError(404, "project not found");
    if (existing.ownerId !== Number(req.user.id))
      throw new HttpError(403, "Forbidden");
    const { title, description } = req.body;
    const project = await prisma.project.update({
      where: { id },
      data: { title, description },
    });
    res.json(project);
  } catch (err) {
    next(err);
  }
}

export async function deleteProject(req, res, next) {
  try {
    const id = Number(req.params.id);
    const existing = await prisma.project.findUnique({ where: { id } });
    if (!existing) throw new HttpError(404, "project not found");
    if (existing.ownerId !== Number(req.user.id))
      throw new HttpError(403, "Forbidden");
    await prisma.project.delete({ where: { id } });
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
}
