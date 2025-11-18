import express from "express";
import pool from "../config/database.js";

/*(CREATE) Tambah truk baru ke master*/
async function insertTruck({
  truk_id,
  class_id,
  max_berat,
  panjang_kir,
  lebar_kir,
  tinggi_kir,
  nomor_kendaraan,
}) {
  try {
    console.log("Gate Server inserting truck with ID:", truk_id);
    const result = await pool.query(
      `INSERT INTO truk_master (truk_id, class_id, max_berat, panjang_kir, lebar_kir, tinggi_kir, nomor_kendaraan)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *  `,
      [
        truk_id,
        class_id,
        max_berat,
        panjang_kir,
        lebar_kir,
        tinggi_kir,
        nomor_kendaraan,
      ]
    );
    console.log("Insert Success:", result.rows[0]);
    return result.rows[0];
  } catch (err) {
    console.error("insertTruck error:", err.message);
    throw new Error("Failed to insert truck");
  }
}

/*(READ) Ambil semua data truk master*/
async function getAllTrucks() {
  try {
    const result = await pool.query(
      "SELECT * FROM truk_master ORDER BY truk_id ASC"
    );
    if (result.rowCount === 0) {
      throw new Error("Truck not found");
    }

    return result.rows;
  } catch (err) {
    console.error("getAllTrucks error:", err.message);
    throw new Error("Failed to fetch trucks");
  }
}

/*(READ) Ambil data truk master berdasarkan ID*/
async function getTruckById(truk_id) {
  try {
    const result = await pool.query(
      "SELECT * FROM truk_master tm WHERE truk_id = $1",
      [truk_id]
    );
    if (result.rowCount === 0) {
      throw new Error("Truck not found");
    }

    return result.rows[0];
  } catch (err) {
    console.error(`getTruckById error (id: ${truk_id}):`, err.message);
    throw new Error("Failed to fetch truck by ID");
  }
}

/*(READ) Manual trigger pengukuran ulang truk berdasarkan nomor kendaraan*/
/* Setara dengan GetTruckByNomorKendaraan */
async function manualMeasure(nomor_kendaraan) {
  try {
    const result = await pool.query(
      // "SELECT * FROM truk_master tm JOIN vehicle_class vc ON tm.class_id = vc.class_id WHERE nomor_kendaraan = $1",
      "SELECT * FROM truk_master tm WHERE nomor_kendaraan = $1",
      [nomor_kendaraan]
    );

    if (result.rowCount === 0) {
      throw new Error("Truck not found");
    }
    const payload = {
      truk_id: result.rows[0].truk_id,
      kelas: result.rows[0].class_id,
      batas_berat: result.rows[0].max_berat,
      batas_panjang: result.rows[0].panjang_kir,
      batas_lebar: result.rows[0].lebar_kir,
      batas_tinggi: result.rows[0].tinggi_kir,
      waktu_mulai: new Date().toISOString(),
    };

    console.log("Truck Data sent to Gate Server: ", payload);
    return payload;
  } catch (err) {
    console.error(
      `manualMeasure error (nomorKendaraan: ${nomorKendaraan}):`,
      err.message
    );
    throw new Error("Failed to fetch truck by nomor kendaraan");
  }
}

/* (UPDATE) fungsi untuk mengupdate data truk master */
async function updateTruckByID(truk_id, updateData) {
  try {
    const allowed = [
      "class_id",
      "max_berat",
      "panjang_kir",
      "lebar_kir",
      "tinggi_kir",
      "nomor_kendaraan",
    ];

    const fields = [];
    const values = [];
    let index = 1;

    // Bangun query dinamis
    for (const key in updateData) {
      if (allowed.includes(key)) {
        fields.push(`${key} = $${index}`);
        values.push(updateData[key]);
        index++;
      }
    }

    if (fields.length === 0) {
      throw new Error("No valid fields to update");
    }

    // truk_id jadi parameter terakhir
    values.push(truk_id);

    const sql = `
      UPDATE truk_master
      SET ${fields.join(", ")}
      WHERE truk_id = $${index}
      RETURNING *
    `;

    const result = await pool.query(sql, values);

    if (result.rowCount === 0) {
      throw new Error("Truck not found");
    }

    return result.rows[0];
  } catch (err) {
    console.error("updateTruck error:", err.message);
    throw new Error("Failed to update truck");
  }
}

// (UPDATE) fungsi untuk mengupdate data truk master berdasarkan nomor kendaraan
async function updateTruckByNomorKendaraan(nomor_kendaraan, updateData) {
  try {
    const allowed = [
      "truk_id",
      "max_berat",
      "panjang_kir",
      "lebar_kir",
      "tinggi_kir",
    ];

    const fields = [];
    const values = [];
    let index = 1;

    // Bangun query dinamis
    for (const key in updateData) {
      if (allowed.includes(key)) {
        fields.push(`${key} = $${index}`);
        values.push(updateData[key]);
        index++;
      }
    }

    if (fields.length === 0) {
      throw new Error("No valid fields to update");
    }

    // nomor_kendaraan jadi parameter terakhir
    values.push(nomor_kendaraan);
    const sql = `
      UPDATE truk_master
      SET ${fields.join(", ")}
      WHERE nomor_kendaraan = $${index}
      RETURNING *
    `;

    const result = await pool.query(sql, values);
    if (result.rowCount === 0) {
      throw new Error("Truck not found");
    }

    return result.rows[0];
  } catch (err) {
    console.error("updateTruckByNomorKendaraan error:", err.message);
    throw new Error("Failed to update truck by nomor kendaraan");
  }
}

// (DELETE) fungsi untuk menghapus data truk master berdasarkan ID/nomor kendaraan
async function deleteTruckById(truk_id) {
  try {
    await pool.query(
      "DELETE FROM truk_master WHERE truk_id = $1 OR nomor_kendaraan = $1",
      [truk_id]
    );
  } catch (err) {
    console.error("deleteTruckById error:", err.message);
    throw new Error("Failed to delete truck");
  }
}

export {
  insertTruck,
  getAllTrucks,
  getTruckById,
  manualMeasure,
  updateTruckByID,
  updateTruckByNomorKendaraan,
  deleteTruckById,
};
