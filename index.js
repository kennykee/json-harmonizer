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

    // Parse all JSON strings
    let parsedList = [];
    for (const str of jsonList) {
      try {
        parsedList.push(JSON.parse(str));
      } catch (e) {
        return res.status(400).json({ success: false, message: "Invalid JSON in list" });
      }
    }

    // Harmonize logic (for demo: merge all objects into one, shallow)
    const harmonized = Object.assign({}, ...parsedList);
    const harmonizedJson = JSON.stringify(harmonized, null, 2);

    // Query logic (for demo: just echo the query and count keys)
    let queryResult = "";
    if (query.trim()) {
      queryResult = `Query: ${query} | Harmonized keys: ${Object.keys(harmonized).length}`;
    }

    res.json({
      success: true,
      harmonizedJson,
      queryResult,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

export default app;
