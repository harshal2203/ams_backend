import express from "express";
const router = express.Router();
import { moduleRoutes } from "./app.routes";

// Routes files
import UserRoutes from "./user.routes";
import CategoryRoutes from "./category.routes";
import ProductRoutes from "./product.routes";
import allocationRoutes from "./allocation.routes"
import comboRoutes from "./combo.routes"

router.use(moduleRoutes.user, UserRoutes);
router.use(moduleRoutes.category, CategoryRoutes);
router.use(moduleRoutes.product, ProductRoutes);
router.use(moduleRoutes.allocation, allocationRoutes);
router.use(moduleRoutes.combo, comboRoutes);

// Redirect when no route matches (Wildcard)
router.use('/*', (req, res, next) => {
  next({ status: 404, message: "The page not found!" });
});

export default router;
