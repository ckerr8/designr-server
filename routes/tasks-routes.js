import express from 'express';
const router = express.Router();
router.route('/tasks')
  .get(getAllTasks)
  .post(validateTask, createTask);

router.route('/tasks/:id')
  .get(getTaskById)
  .put(validateTask, updateTask)
  .delete(deleteTask);

export default router;