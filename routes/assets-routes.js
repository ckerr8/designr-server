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

router
.route('/:id')
  .get(AssetsController.getAssetById)
  .delete(AssetsController.deleteAssetById)
  .put(AssetsController.updateAsset);
//   .putAssetsController.validateAsset, AssetsController.updateAsset)
  
  export default router;