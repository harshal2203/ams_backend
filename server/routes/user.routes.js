import express from 'express';
const router = express.Router();

import validateRequest from "../middleware/validateRequest.middleware";
import userController from "../controllers/user.controller";
import authMiddleware from "../middleware/auth.middleware";
import userValidator from "../validators/user.validator";
import { userRoutes } from "./app.routes";

// User routes // 
router.get(userRoutes.profile.path,[authMiddleware] ,userController.userProfile);
router.get(userRoutes.emp_profile.path,[authMiddleware], userController.emp_userProfile);
router.get(userRoutes.users.path, userController.users);
router.post(userRoutes.create.path, [authMiddleware,userValidator.createUser(), validateRequest], userController.createUser);

router.post(userRoutes.login.path, [userValidator.login(), validateRequest], userController.login);
router.post(userRoutes.changePassword.path,[authMiddleware,userValidator.changePassword(),validateRequest],userController.changePassword)

router.delete(userRoutes.logout.path,[authMiddleware],userController.logout)


 router.delete(userRoutes.delete.path, [authMiddleware], userController.deleteUser);


router.patch(userRoutes.update.path, [authMiddleware,userValidator.updateUser(), validateRequest],userController.updateUser)
router.patch(userRoutes.status_change.path, [authMiddleware,validateRequest], userController.changestatus)

export default router;
