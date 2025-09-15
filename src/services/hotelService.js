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
  console.log(harmonizedList);

  for (const hotel of harmonizedList) {
    const id = hotel.id;
    if (!id) continue;
    if (!hotelsById[id]) {
      hotelsById[id] = { ...hotel };
    } else {
      hotelsById[id] = _.mergeWith(hotelsById[id] || {}, hotel, mergeNonEmpty);
    }
  }
  const mergedHotels = Object.values(hotelsById);

  return mergedHotels;
};

function mergeNonEmpty(objValue, srcValue) {
  if (srcValue === null || srcValue === "") return objValue;

  if (Array.isArray(srcValue)) {
    if (srcValue.length === 0) return objValue; // skip empty array
    return srcValue; // overwrite with non-empty array
  }

  if (_.isPlainObject(srcValue) && _.isPlainObject(objValue)) {
    return _.mergeWith({}, objValue, srcValue, mergeNonEmpty);
  }

  return srcValue;
}

export { harmonizeData };
