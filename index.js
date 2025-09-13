import dotenv from "dotenv";
import express from "express";
import path from "path";
import { harmonizeData } from "./src/services/hotelService.js";

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
    const { jsonList, ids, destinationIds } = req.body;
    let hotels = harmonizeData(jsonList);

    if (ids || destinationIds) {
      const idSet = new Set(
        (ids || "")
          .split(",")
          .map((id) => id.trim())
          .filter((id) => id)
      );
      const destIdSet = new Set(
        (destinationIds || "")
          .split(",")
          .map((id) => id.trim())
          .filter((id) => id)
      );
      hotels = hotels.filter((hotel) => {
        const matchId = idSet.size === 0 || idSet.has(hotel.id);
        const matchDest = destIdSet.size === 0 || destIdSet.has(hotel.destination_id);
        return matchId && matchDest;
      });
    }
    res.json({ success: true, data: JSON.stringify(hotels) });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}
