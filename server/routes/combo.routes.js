import express from 'express';
const router = express.Router();
import comboValidator from '../validators/combo.validator';
import comboController from "../controllers/combo.controller";
import { comboRoutes} from "./app.routes";
import validateRequest from "../middleware/validateRequest.middleware";
import authMiddleware from "../middleware/auth.middleware";
                                             
// Allocation routes // 

router.get(comboRoutes.get.path,[authMiddleware], comboController.getCombo);

router.post(comboRoutes.create.path,[authMiddleware,comboValidator.createCombo(), validateRequest], comboController.createCombo);

router.patch(comboRoutes.update.path, [authMiddleware,comboValidator.createCombo(),validateRequest], comboController.updateCombo)

router.delete(comboRoutes.delete.path, [authMiddleware,validateRequest], comboController.deleteCombo)

export default router;

