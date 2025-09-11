import Mapper from "node-object-mapper";
import hotelMappingFull from "./main_schema.js";
import arraySubSchemas from "./sub_schema.js";

export function mapInput(inputs, schemaName) {
  const mapper = new Mapper(hotelMappingFull);
  const inputArray = Array.isArray(inputs) ? inputs : [inputs];

  const mappedArray = inputArray.map((item) => {
    // First pass: map main object
    const mapped = mapper.map(item);

    // Second pass: iterate all registered array-of-object paths
    Object.entries(arraySubSchemas).forEach(([path, subSchema]) => {
      const arrayValue = path.split(".").reduce((acc, key) => acc?.[key], mapped);

      if (Array.isArray(arrayValue)) {
        const subMapper = new Mapper(subSchema);

        const newArray = arrayValue.map((obj) => subMapper.map(obj));

        // Set the transformed array back into mapped object
        const lastKey = path.split(".").pop();
        const parent = path
          .split(".")
          .slice(0, -1)
          .reduce((acc, key) => acc[key], mapped);

        if (parent) parent[lastKey] = newArray;
      }
    });

    return mapped;
  });

  return Array.isArray(inputs) ? mappedArray : mappedArray[0];
}
