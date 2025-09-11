import dotenv from "dotenv";
import express from "express";
import path from "path";

dotenv.config();

const app = express();
const PORT = parseInt(process.env.PORT || "4000", 10);

app.use(express.static(path.join(process.cwd(), "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// controller - base page
app.get("/", (req, res) => {
  res.sendFile(path.join(process.cwd(), "public", "index.html"));
});

// controller - harmonize json
app.post("/harmonize", async (req, res) => {
  try {
    const { jsonList, query } = req.body;

    if (!Array.isArray(jsonList) || typeof query !== "string") {
      return res.status(400).json({ success: false, message: "Invalid input" });
    }

    // Parse and normalize input keys
    const parsedList = jsonList.map((str) => {
      try {
        return keysToLower(JSON.parse(str));
      } catch {
        throw new Error("Invalid JSON in list");
      }
    });

    // Harmonize: shallow merge
    const harmonized = Object.assign({}, ...parsedList);
    const harmonizedJson = JSON.stringify(harmonized, null, 2);

    // Demo query logic
    const queryResult = query.trim() ? `Query: ${query} | Harmonized keys: ${Object.keys(harmonized).length}` : "";

    res.json({ success: true, harmonizedJson, queryResult });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Recursively lowercase keys in objects/arrays
const keysToLower = (obj) =>
  Array.isArray(obj)
    ? obj.map(keysToLower)
    : obj && typeof obj === "object"
    ? Object.fromEntries(Object.entries(obj).map(([k, v]) => [k.toLowerCase(), keysToLower(v)]))
    : obj;

export default app;
