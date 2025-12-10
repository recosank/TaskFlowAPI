import prisma from "../prismaClient.js";
import { HttpError } from "../utils/errorHandler.js";

export async function listTasks(req, res, next) {
  try {
    const projectId = Number(req.params.projectId);
    const userId = Number(req.user.id);
    const project = await prisma.project.findUnique({
      where: { id: projectId, ownerId: userId },
    });
    if (!project)
      throw new HttpError(404, "project not found or access denied");
    const tasks = await prisma.task.findMany({ where: { projectId } });
    res.json(tasks);
  } catch (err) {
    next(err);
  }
}

export async function getDashboardTasks(req, res, next) {
  try {
    const userId = Number(req.user.id);

    const userProjects = await prisma.project.findMany({
      where: { ownerId: userId },
      select: { id: true },
    });

    const projectIds = userProjects.map((project) => project.id);

    if (projectIds.length === 0) {
      return res.json({
        totalTasks: 0,
        todo: 0,
        inprogress: 0,
        completed: 0,
        pending: 0,
        progressPercent: 0,
        projectCount: 0,
      });
    }

    const [totalTasks, todoCount, inprogressCount, completedCount] =
      await Promise.all([
        prisma.task.count({
          where: { projectId: { in: projectIds } },
        }),
        prisma.task.count({
          where: {
            projectId: { in: projectIds },
            status: "pending",
          },
        }),
        prisma.task.count({
          where: {
            projectId: { in: projectIds },
            status: "inprogress",
          },
        }),
        prisma.task.count({
          where: {
            projectId: { in: projectIds },
            status: "done",
          },
        }),
      ]);

    const pending = todoCount + inprogressCount;
    const progressPercent =
      totalTasks === 0 ? 0 : Math.round((completedCount / totalTasks) * 100);

    return res.json({
      totalTasks,
      todo: todoCount,
      inprogress: inprogressCount,
      completed: completedCount,
      pending,
      progressPercent,
      projectCount: projectIds.length,
    });
  } catch (err) {
    next(err);
  }
}
export async function createTask(req, res, next) {
  try {
    const { projectId, title, description, priority, status, dueDate } =
      req.body;
    const project = await prisma.project.findUnique({
      where: { id: Number(projectId) },
    });
    if (!project) throw new HttpError(404, "project not found");
    if (project.ownerId !== Number(req.user.id))
      throw new HttpError(403, "Forbidden");

    const task = await prisma.task.create({
      data: {
        projectId: Number(projectId),
        title,
        description,
        priority,
        status: status || "pending",
        dueDate: dueDate ? new Date(dueDate) : null,
      },
    });
    res.status(201).json(task);
  } catch (err) {
    next(err);
  }
}

export async function updateTask(req, res, next) {
  try {
    const id = Number(req.params.id);
    const existing = await prisma.task.findUnique({ where: { id } });
    if (!existing) throw new HttpError(404, "task not found");

    const project = await prisma.project.findUnique({
      where: { id: existing.projectId },
    });
    if (!project) throw new HttpError(404, "project not found");
    if (project.ownerId !== Number(req.user.id))
      throw new HttpError(403, "Forbidden");

    const data = { ...req.body };
    if (data.dueDate) data.dueDate = new Date(data.dueDate);
    const task = await prisma.task.update({ where: { id }, data });
    res.json(task);
  } catch (err) {
    next(err);
  }
}

export async function searchTasks(req, res, next) {
  try {
    const { projectId, q, status, priority } = req.query;

    if (!projectId) {
      throw new HttpError(400, "projectId is required");
    }

    const projectIdNum = Number(projectId);
    if (Number.isNaN(projectIdNum)) {
      throw new HttpError(400, "Invalid projectId");
    }

    const project = await prisma.project.findUnique({
      where: { id: projectIdNum },
    });
    if (!project) throw new HttpError(404, "Project not found");
    if (project.ownerId !== Number(req.user.id))
      throw new HttpError(403, "Forbidden");

    const where = {
      projectId: projectIdNum,
    };

    if (status) {
      where.status = status;
    }

    if (priority) {
      where.priority = priority;
    }

    if (q && q.trim() !== "") {
      where.OR = [
        {
          title: {
            contains: q,
            mode: "insensitive",
          },
        },
        {
          description: {
            contains: q,
            mode: "insensitive",
          },
        },
      ];
    }

    const tasks = await prisma.task.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    res.json(tasks);
  } catch (err) {
    next(err);
  }
}

export async function deleteTask(req, res, next) {
  try {
    const id = Number(req.params.id);
    const existing = await prisma.task.findUnique({ where: { id } });
    if (!existing) throw new HttpError(404, "task not found");

    const project = await prisma.project.findUnique({
      where: { id: existing.projectId },
    });
    if (!project) throw new HttpError(404, "project not found");
    if (project.ownerId !== Number(req.user.id))
      throw new HttpError(403, "Forbidden");

    await prisma.task.delete({ where: { id } });
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
}
