import express from 'express';
const router = express.Router();
import categoryValidator from '../validators/category.validator';
import categoryController from "../controllers/category.controller";
import { categoryRoutes} from "./app.routes";
import validateRequest from "../middleware/validateRequest.middleware";
import authMiddleware from "../middleware/auth.middleware";
                                             
// Company routes // 
router.get(categoryRoutes.category_details.path, [authMiddleware],categoryController.categoryDetails);
router.get(categoryRoutes.category_list.path, [authMiddleware],categoryController.categoryList);
//get stock
router.get(categoryRoutes.stock.path, categoryController.generateStock);
router.get(categoryRoutes.profile.path,[authMiddleware], categoryController.categoryProfile);



router.post(categoryRoutes.create.path,[authMiddleware,categoryValidator.createCategory(), validateRequest], categoryController.createCategory);

router.patch(categoryRoutes.update.path, [authMiddleware,categoryValidator.createCategory(),validateRequest], categoryController.updateCategory)
router.patch(categoryRoutes.status_change.path, [authMiddleware,validateRequest], categoryController.changestatus)

router.delete(categoryRoutes.delete.path, [authMiddleware,validateRequest], categoryController.deleteCategory)
router.delete(categoryRoutes.multiple_delete.path, [authMiddleware,validateRequest], categoryController.multipleDeleteCategory)

export default router;

