import express from "express";
import {
  insertVehicleClass,
  getAllVehicleClasses,
  getVehicleClassById,
  updateVehicleClass,
  deleteVehicleClassById,
} from "../controllers/vehicleClass.js";
const router = express.Router();

// (CREATE) Tambah data vehicle class baru
router.post("/", async (req, res, next) => {
  try {
    const newVehicleClass = await insertVehicleClass(req.body);
    res.json(newVehicleClass);
  } catch (error) {
    next(error);
  }
});
// (READ) Ambil semua data vehicle class
router.get("/", async (req, res, next) => {
  try {
    const vehicleClasses = await getAllVehicleClasses();
    res.json(vehicleClasses);
  } catch (error) {
    next(error);
  }
});
// (READ) Ambil data vehicle class berdasarkan ID
router.get("/:id", async (req, res, next) => {
  try {
    const vehicleClass = await getVehicleClassById(req.params.id);
    res.json(vehicleClass);
  } catch (error) {
    next(error);
  }
});
// (UPDATE) Update data vehicle class berdasarkan ID
router.put("/:id", async (req, res, next) => {
  try {
    const updatedVehicleClass = await updateVehicleClass(
      req.params.id,
      req.body
    );
    res.json(updatedVehicleClass);
  } catch (error) {
    next(error);
  }
});
// (DELETE) Hapus data vehicle class berdasarkan ID
router.delete("/:id", async (req, res, next) => {
  try {
    await deleteVehicleClassById(req.params.id);
    res.send();
  } catch (error) {
    next(error);
  }
});
export default router;
