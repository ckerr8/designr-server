import express from 'express';
import * as TasksController from '../controllers/tasks-controller.js'

const router = express.Router();

// Middleware to handle errors
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

router.route('/')
  .get(TasksController.getAllTasks)
  .post(TasksController.createTask);
//   .post(validateTask, createTask);

router.route('/:id')
  .get(TasksController.getTaskById)
  .put(TasksController.updateTaskbyId)
  .delete(TasksController.deleteTaskById);
export default router;