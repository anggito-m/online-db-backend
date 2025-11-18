import pool from "../config/database.js";

// Nama Table: vehicle_class
// Nama Kolom: class_id (Primary Key), class_name, max_berat, max_panjang, max_lebar, max_tinggi

/*(CREATE) Tambah class kendaraan baru ke V*/
async function insertVehicleClass({
  class_name,
  max_berat,
  max_panjang,
  max_lebar,
  max_tinggi,
}) {
  try {
    const result = await pool.query(
      `INSERT INTO vehicle_class (class_name, max_berat, max_panjang, max_lebar, max_tinggi)
       VALUES ($1, $2, $3, $4, $5)
         RETURNING *  `,
      [class_name, max_berat, max_panjang, max_lebar, max_tinggi]
    );
    return result.rows[0];
  } catch (err) {
    console.error("insertVehicleClass error:", err.message);
    throw new Error("Failed to insert vehicle class");
  }
}

/*(READ) Ambil semua data vehicle class*/
async function getAllVehicleClasses() {
  try {
    const result = await pool.query(
      "SELECT * FROM vehicle_class ORDER BY class_id ASC"
    );
    return result.rows;
  } catch (err) {
    console.error("getAllVehicleClasses error:", err.message);
    throw new Error("Failed to fetch vehicle classes");
  }
}
/*(READ) Ambil data vehicle class berdasarkan ID*/
async function getVehicleClassById(class_id) {
  try {
    const result = await pool.query(
      "SELECT * FROM vehicle_class WHERE class_id = $1",
      [class_id]
    );
    return result.rows[0];
  } catch (err) {
    console.error(`getVehicleClassById error (id: ${class_id}):`, err.message);
    throw new Error("Failed to fetch vehicle class by ID");
  }
}

/*(UPDATE) Update data vehicle class berdasarkan ID*/
async function updateVehicleClass(class_id, updates) {
  try {
    const allowed = [
      "class_name",
      "max_berat",
      "max_panjang",
      "max_lebar",
      "max_tinggi",
    ];
    const fields = [];
    const values = [];
    let index = 1;

    // Loop hanya field yang dikirim user
    for (const key in updates) {
      if (allowed.includes(key)) {
        fields.push(`${key} = $${index}`);
        values.push(updates[key]);
        index++;
      }
    }

    if (fields.length === 0) {
      throw new Error("No valid fields to update");
    }

    // Tambahkan class_id sebagai parameter terakhir
    values.push(class_id);

    const sql = `
      UPDATE vehicle_class
      SET ${fields.join(", ")}
      WHERE class_id = $${index}
      RETURNING *
    `;

    const result = await pool.query(sql, values);

    if (result.rowCount === 0) {
      throw new Error("Vehicle class not found");
    }

    return result.rows[0];
  } catch (err) {
    console.error(`updateVehicleClass error (id: ${class_id}):`, err.message);
    throw new Error("Failed to update vehicle class");
  }
}

/*(DELETE) Hapus data vehicle class berdasarkan ID*/
async function deleteVehicleClassById(class_id) {
  try {
    const result = await pool.query(
      "DELETE FROM vehicle_class WHERE class_id = $1 RETURNING *",
      [class_id]
    );
    return result.rows[0];
  } catch (err) {
    console.error(
      `deleteVehicleClassById error (id: ${class_id}):`,
      err.message
    );
    throw new Error("Failed to delete vehicle class");
  }
}
export {
  insertVehicleClass,
  getAllVehicleClasses,
  getVehicleClassById,
  updateVehicleClass,
  deleteVehicleClassById,
};
