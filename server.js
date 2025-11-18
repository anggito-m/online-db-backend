import express from "express";
import router from "./routes/index.js";
import errorHandler from "./middlewares/errorHandler.js";

const app = express();
const PORT = process.env.PORT || 3001;
app.use(express.json());

// Gunakan router untuk rute truk
app.use("/kemenhub", router);

// Gunakan middleware error handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
