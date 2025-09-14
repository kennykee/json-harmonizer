import objectMapper from "object-mapper";
import schema from "../config/schema.js";
import { cleanKeys } from "../utils/helper.js";
import _ from "lodash";

const harmonizeData = (jsonList) => {
  if (!Array.isArray(jsonList)) {
    throw new Error("Invalid input");
  }

  const parsedList = jsonList.map((str) => {
    try {
      return cleanKeys(JSON.parse(str));
    } catch {
      throw new Error("Invalid JSON in list");
    }
  });

  const harmonizedList = parsedList.map((item) => objectMapper(item, schema));

  const hotelsById = {};
  for (const hotel of harmonizedList) {
    const id = hotel.id;
    if (!id) continue;
    if (!hotelsById[id]) {
      hotelsById[id] = { ...hotel };
    } else {
      hotelsById[id] = _.mergeWith(hotelsById[id], hotel, (objValue, srcValue) => {
        if (srcValue === null || srcValue === "") {
          return objValue;
        }
        return srcValue;
      });
    }
  }
  const mergedHotels = Object.values(hotelsById);

  return mergedHotels;
};

export { harmonizeData };
