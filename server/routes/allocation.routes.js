import express from 'express';
const router = express.Router();
import allocationValidator from '../validators/allocation.validator';
import allocationController from "../controllers/allocation.controller";
import { allocationRoutes} from "./app.routes";
import validateRequest from "../middleware/validateRequest.middleware";
import authMiddleware from "../middleware/auth.middleware";
                                             
// Allocation routes // 
// router.get(allocationRoutes.combo_details.path, /* [authMiddleware], */allocationController.categoryDetails);
// router.get(allocationRoutes.profile.path,/* [authMiddleware], */ allocationController.categoryProfile);

router.post(allocationRoutes.create.path,[authMiddleware,allocationValidator.createAllocation(), validateRequest], allocationController.createAllocation);

router.get(allocationRoutes.get.path, allocationController.getAllocation);
router.get(allocationRoutes.allocation_details.path, allocationController.allocationDetails);


router.delete(allocationRoutes.delete.path, [authMiddleware,validateRequest], allocationController.deleteAllocation)


router.patch(allocationRoutes.update.path,[authMiddleware,allocationValidator.createAllocation(), validateRequest], allocationController.updateAllocation)

export default router;

