// src/utils/object-mapper/index.js
import _ from "lodash";
import * as schemas from "./schema.js";

/**
 * Maps nested input object(s) to a nested output object using aliases
 * @param {Object|Object[]} inputs - Single or multiple input objects
 * @param {string} schemaName - Name of mapping schema
 * @returns {Object} - Combined mapped output
 */
export function mapInput(inputs, schemaName) {
  const schema = schemas[schemaName];
  if (!schema) throw new Error(`Schema "${schemaName}" not found`);

  const arr = Array.isArray(inputs) ? inputs : [inputs];
  const output = {};

  arr.forEach((input) => {
    for (const [outPath, aliases] of Object.entries(schema)) {
      for (const alias of aliases) {
        const value = _.get(input, alias);
        if (value !== undefined && value !== null) {
          _.set(output, outPath, value);
          break; // stop at first found alias
        }
      }
    }
  });

  return output;
}
