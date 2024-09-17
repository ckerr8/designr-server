import express from 'express';
import * as ClientsController from '../controllers/client-controller.js'
const router = express.Router();

// Middleware to handle errors
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

// Client routes
router.route('/')
  .get(asyncHandler(ClientsController.getAllClients))
  .post(asyncHandler(ClientsController.createClient));

router.route('/:id')
  .get(asyncHandler(ClientsController.getClient))
//   .put(asyncHandler(ClientsController.validateClient), asyncHandler(ClientsController.updateClient))
//   .delete(asyncHandler(ClientsController.deleteClient));

export default router;