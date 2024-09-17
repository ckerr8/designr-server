import express from 'express';

const router = express.Router();

// Middleware to handle errors
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

// Client routes
router.route('/clients')
  .get(getAllClients)
  .post(validateClient, createClient);

router.route('/clients/:id')
  .get(getClientById)
  .put(validateClient, updateClient)
  .delete(deleteClient);
  export default router;