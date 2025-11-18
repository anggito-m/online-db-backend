import express from "express";
import truckRouter from "./truckRouter.js";
import vehicleClassRouter from "./vehicleClassRouter.js";

const router = express.Router();

router.use("/truck", truckRouter);
router.use("/vehicle-class", vehicleClassRouter);

export default router;
