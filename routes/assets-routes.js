import express from 'express';

const router = express.Router();

const asyncHandler = (fn) => (req, res, next) =>
    Promise.resolve(fn(req, res, next)).catch(next);  

router
.route('/design-assets')
  .get(getAllDesignAssets)
  .post(validateDesignAsset, createDesignAsset);

router
.route('/design-assets/:id')
  .get(getDesignAssetById)
  .put(validateDesignAsset, updateDesignAsset)
  .delete(deleteDesignAsset);
  
  export default router;