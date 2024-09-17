// // import { getAllClients } from '../controllers/client-controller';
// import express from 'express';

// const router = express.Router();

// // Middleware to handle errors
// const asyncHandler = (fn) => (req, res, next) =>
//   Promise.resolve(fn(req, res, next)).catch(next);

// router
//     .route('/projects')
//     .get(getAllProjects)
//     .post(validateProject, createProject);

// router
//     .route('/projects/:id')
//     .get(getProjectById)
//     .put(validateProject, updateProject)
//     .delete(deleteProject);

//     export default router;