import dotenv from "dotenv";
import express from "express";
import path from "path";
import { Op } from "sequelize";
import sequelize from "./config/database.js";
import Status from "./models/Status.js";

dotenv.config();

const app = express();
const PORT = parseInt(process.env.PORT || "4000", 10);

if (process.env.NODE_ENV !== "test") {
  sequelize
    .authenticate()
    .then(() => console.log("Database connected"))
    .catch((err) => console.error("Unable to connect to the database:", err));
}

app.use(express.static(path.join(process.cwd(), "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// controller - base page
app.get("/", (req, res) => {
  res.sendFile(path.join(process.cwd(), "views", "index.html"));
});

// controller - retrieve latest results as per requirements
app.get("/record", async (req, res) => {
  try {
    const statuses = await Status.findOne({
      attributes: ["id", "description", "indicator", "componentStatuses", "incidents", "maintenances", "createdAt"],
      order: [["createdAt", "DESC"]],
    });

    res.json(statuses);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
    console.error(error);
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

export default app;
