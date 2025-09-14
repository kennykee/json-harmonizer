import objectMapper from "object-mapper";
import schema from "../config/schema.js";
import { cleanKeys } from "../utils/helper.js";
import _ from "lodash";

const harmonizeData = (jsonList) => {
  if (!Array.isArray(jsonList)) {
    throw new Error("Invalid input");
  }

  let parsedList = jsonList.map((str) => {
    try {
      return cleanKeys(JSON.parse(str));
    } catch {
      throw new Error("Invalid JSON in list");
    }
  });

  parsedList = parsedList.flat();

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
        // Allow overwrite if srcValue is an empty array
        if (Array.isArray(srcValue)) {
          if (srcValue.length === 0) {
            return objValue;
          } else {
            return srcValue;
          }
        }
        return srcValue;
      });
    }
  }
  const mergedHotels = Object.values(hotelsById);

  return mergedHotels;
};

export { harmonizeData };
