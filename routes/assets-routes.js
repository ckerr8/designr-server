import express from 'express';
import * as AssetsController from "../controllers/assets-controller.js";
const router = express.Router();

const asyncHandler = (fn) => (req, res, next) =>
    Promise.resolve(fn(req, res, next)).catch(next);  

router
.route('/')
  .get(asyncHandler(AssetsController.getAllAssets));
//   .post(validateDesignAsset, createDesignAsset);

// router
// .route('/design-assets/:id')
//   .get(getDesignAssetById)
//   .put(validateDesignAsset, updateDesignAsset)
//   .delete(deleteDesignAsset);
  
  export default router;