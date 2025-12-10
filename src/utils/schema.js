import { z } from "zod";

export const taskSchema = z.object({
  projectId: z.number().int(),
  title: z.string().min(1),
  description: z.string().optional(),
  priority: z.string().optional(),
  status: z.string().optional(),
  dueDate: z.string().optional(),
});

export const projectSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
});

export const signUpSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});
