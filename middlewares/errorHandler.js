export default function errorHandler(err, req, res, next) {
  console.error("GLOBAL ERROR:", err.message);

  if (err.message === "Truck not found") {
    return res.status(404).json({ error: err.message });
  }

  if (err.message === "No valid fields to update") {
    return res.status(400).json({ error: err.message });
  }

  // failed to insert
  if (err.message === "Failed to insert truck") {
    return res.status(500).json({ error: err.message });
  }

  return res.status(500).json({ error: "Internal server error" });
}
