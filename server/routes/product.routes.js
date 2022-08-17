import express from 'express';
const router = express.Router();
import productValidator from '../validators/product.validator';
import productController from "../controllers/product.controller";
import { productRoutes } from "./app.routes";
import validateRequest from "../middleware/validateRequest.middleware";
import authMiddleware from "../middleware/auth.middleware";

// Company routes // 
router.get(productRoutes.product_details.path, [authMiddleware],productController.productDetails);
router.get(productRoutes.profile.path,[authMiddleware], productController.productProfile);

router.post(productRoutes.create.path,[authMiddleware,productValidator.createProduct(), validateRequest], productController.createProduct);

router.patch(productRoutes.update.path, [authMiddleware,productValidator.createProduct(),validateRequest], productController.updateProduct);
router.patch(productRoutes.status_change.path, /* [authMiddleware,validateRequest], */ productController.changestatus)

router.delete(productRoutes.delete.path, [authMiddleware,validateRequest], productController.deleteProduct);

export default router;

