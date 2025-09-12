import dotenv from "dotenv";
import express from "express";
import path from "path";
import objectMapper from "object-mapper";
import schema from "./src/config/schema.js";
import fs from "fs";

dotenv.config();

const app = express();
const PORT = parseInt(process.env.PORT || "4000", 10);

app.use(express.static(path.join(process.cwd(), "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.sendFile(path.join(process.cwd(), "public", "index.html"));
});

app.post("/harmonize", async (req, res) => {
  try {
    const { jsonList, query } = req.body;
    const result = harmonizeData(jsonList, query);
    res.json(result);
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}
