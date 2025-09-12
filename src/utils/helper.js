export function loadAndHarmonize() {
  try {
    // List of JSON file paths
    const filePaths = ["test/acme.json", "test/paperflies.json", "test/patagonia.json"];
    // Read JSON files
    const jsonList = filePaths.map((path) => {
      try {
        return fs.readFileSync(path, "utf8");
      } catch (err) {
        throw new Error(`Failed to read file ${path}: ${err.message}`);
      }
    });

    // Call harmonizeData with a sample query
    const query = "hotel data harmonization";
    const result = harmonizeData(jsonList, query);

    // Print output
    console.log("Harmonized JSON:");
    console.log(result.harmonizedJson);
    console.log("\nQuery Result:");
    console.log(result.queryResult);

    return result;
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
