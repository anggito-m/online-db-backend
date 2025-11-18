import express from "express";
import {
  insertTruck,
  getAllTrucks,
  getTruckById,
  manualMeasure,
  updateTruckByID,
  deleteTruckById,
} from "../controllers/truk.js";

const router = express.Router();

// (CREATE) Tambah data truk baru
router.post("/", async (req, res, next) => {
  try {
    const newTruck = await insertTruck(req.body);
    res.json(newTruck);
  } catch (error) {
    next(error);
  }
});
// (READ) Ambil semua data truk
router.get("/", async (req, res, next) => {
  try {
    const trucks = await getAllTrucks();
    res.json(trucks);
  } catch (error) {
    next(error);
  }
});
// (READ) Ambil data truk berdasarkan ID
router.get("/:id", async (req, res, next) => {
  try {
    const truck = await getTruckById(req.params.id);
    res.json(truck);
  } catch (error) {
    next(error);
  }
});
// (MANUAL MEASURE) Manual pengukuran truk
router.get("/manual-measure/:nomor_kendaraan", async (req, res, next) => {
  try {
    const measuredTruck = await manualMeasure(req.params.nomor_kendaraan);
    res.json(measuredTruck);
  } catch (error) {
    next(error);
  }
});
// (UPDATE) Update data truk berdasarkan ID
router.put("/:id", async (req, res, next) => {
  try {
    const updatedTruck = await updateTruckByID(req.params.id, req.body);
    res.json(updatedTruck);
  } catch (error) {
    next(error);
  }
});
// (DELETE) Hapus data truk berdasarkan ID
router.delete("/:id", async (req, res, next) => {
  try {
    await deleteTruckById(req.params.id);
    res.send();
  } catch (error) {
    next(error);
  }
});

export default router;
