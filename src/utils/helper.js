import fs from "fs";
import path from "path";
import { harmonizeData } from "../services/hotelService.js";

export function loadAndHarmonize() {
  try {
    const filePaths = ["acme.json", "paperflies.json", "patagonia.json"];
    const jsonList = filePaths.map((filePath) => {
      filePath = path.join(process.cwd(), "public", "assets", "sample", filePath);

      try {
        return fs.readFileSync(filePath, "utf8");
      } catch (err) {
        throw new Error(`Failed to read file ${filePath}: ${err.message}`);
      }
    });

    const harmonized = harmonizeData(jsonList);

    console.log("Harmonized JSON:");
    console.log(JSON.stringify(harmonized));

    return { success: true, harmonizedJson: JSON.stringify(harmonized) };
  } catch (err) {
    console.error("Error:", err.message);
    return { success: false, message: err.message };
  }
}

export function cleanKeys(obj) {
  if (Array.isArray(obj)) {
    return obj.map(cleanKeys);
  }
  if (typeof obj !== "object" || obj === null) {
    return obj;
  }
  return Object.keys(obj).reduce((acc, key) => {
    const cleanedKey = key.toLowerCase().replace(/_/g, "");
    acc[cleanedKey] = cleanKeys(obj[key]);
    return acc;
  }, {});
}
