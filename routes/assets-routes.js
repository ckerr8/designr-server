import express from 'express';
import * as AssetsController from "../controllers/assets-controller.js";
const router = express.Router();

const asyncHandler = (fn) => (req, res, next) =>
    Promise.resolve(fn(req, res, next)).catch(next);  

router
.route('/')
  .get(asyncHandler(AssetsController.getAllAssets))
  .post(asyncHandler(AssetsController.createAsset));
//   .post(validateAsset, createAsset);

// router
// .route('/design-assets/:id')
//   .get(getAssetById)
//   .put(validateAsset, updateAsset)
//   .delete(deleteAsset);
  
  export default router;