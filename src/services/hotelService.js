import objectMapper from "object-mapper";
import schema from "../config/schema.js";
import { cleanKeys } from "../utils/helper.js";

const harmonizeData = (jsonList, query) => {
  if (!Array.isArray(jsonList) || typeof query !== "string") {
    throw new Error("Invalid input");
  }

  // Parse and clean JSON strings (lowercase keys and remove underscores)
  const parsedList = jsonList.map((str) => {
    try {
      return cleanKeys(JSON.parse(str));
    } catch {
      throw new Error("Invalid JSON in list");
    }
  });

  // Map each object using the schema
  const harmonizedList = parsedList.map((item) => objectMapper(item, schema));

  // Merge hotel objects by 'id'
  const hotelsById = {};
  for (const hotel of harmonizedList) {
    const id = hotel.id;
    if (!id) continue;
    if (!hotelsById[id]) {
      hotelsById[id] = { ...hotel };
    } else {
      // Merge properties, prioritizing later objects in case of conflicts
      hotelsById[id] = { ...hotelsById[id], ...hotel };
      // Optionally, merge nested objects/arrays more deeply if needed
    }
  }
  const mergedHotels = Object.values(hotelsById);
  const harmonizedJson = JSON.stringify(mergedHotels, null, 2);

  // Demo query logic
  const queryResult = query.trim() ? `Query: ${query} | Harmonized hotels: ${mergedHotels.length}` : "";

  return { success: true, harmonizedJson, queryResult };
};

export default harmonizeData;
