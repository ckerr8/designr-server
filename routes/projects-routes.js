// import { getAllProjects } from '../controllers/client-controller';
import express from 'express';
import * as ProjectsController from '../controllers/projects-controller.js'; 
const router = express.Router();

// Middleware to handle errors
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

router
    .route('/')
    .get(asyncHandler(ProjectsController.getAllProjects))
    .post(asyncHandler(ProjectsController.createProject));

// router
//     .route('/:id')
//     .get(ProjectsController.getProjectById);
//     .put(ProjectsController.validateProject, ProjectsController.updateProject)
//     .delete(ProjectsController.deleteProject);

router
    .route('/:id')
    .get(ProjectsController.getProjectWithTasks)
    .delete(ProjectsController.deleteProjectById)
    .put(ProjectsController.updateProject)
    .post(ProjectsController.createTaskForProject);

    export default router;