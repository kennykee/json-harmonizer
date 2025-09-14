# JSON Harmonizer

JSON Harmonizer is a Node.js/Express web app and API that harmonizes hotel data from multiple JSON sources into a unified schema. It is designed to help you map, clean, and merge hotel data from different providers, making integration and analysis easier.

## Features

- Harmonizes different JSON formats into a common hotel schema
- Cleans and normalizes keys (lowercase, removes underscores)
- Merges hotel data by ID, with smart overwrite rules
- Web UI for interactive harmonization and filtering
- REST API for programmatic access

---

## Installation

1. **Clone the repository:**

   ```sh
   git clone https://github.com/kennykee/json-harmonizer.git
   cd json-harmonizer
   ```

2. **Install dependencies:**

   ```sh
   npm install
   ```

3. **Run the app:**

   ```sh
   npm start
   ```

   The app will be available at [http://localhost:4000](http://localhost:4000) by default.

4. **Development mode (with auto-reload):**

   ```sh
   npm run dev
   ```

5. **Run tests:**
   ```sh
   npm test
   ```

---

## Pipeline

1. Lowercase all source keys to harmonize source case
2. Remove underscores to harmonize into alphanumeric
3. Map to schema (`src/config/schema.js`)
4. Flatten the results to prepare for merging
5. Merge and replace only if the new value is non-null or an empty array (empty string and null are ignored)

---

## Assumptions

1. The JSON property values are considered equivalent across different sources. For example:
   - Source 1: `"Facilities": ["Pool", "WiFi ", "Aircon"]`
   - Source 2: `"Facilities": ["Pool Table", "Wireless ", "Aircond"]`
2. Another source's data can overwrite previous source data, assuming it provides the correct information.

---

## API

### `POST /harmonize`

Harmonize and filter hotel data from multiple JSON sources.

- **Base URL:** Domain where the app is hosted (default: `http://localhost:4000`)
- **Request Body (application/json):**
  ```json
  {
     "jsonList": ["<JSON Data Source 1>", "<JSON Data Source 2>", "<JSON Data Source 3>", ...],
     "ids": "iJhz, SjyX, f8c9",   // optional, comma-separated hotel ids
     "destinationIds": "100,200"  // optional, comma-separated destination ids
  }
  ```
- **Response (application/json):**
  ```json
  {
     "success": true,
     "data": "[ ...harmonized hotels as JSON... ]"
  }
  // or on error
  {
     "success": false,
     "message": "Error message"
  }
  ```

#### Example `curl` request

```sh
curl -X POST http://localhost:4000/harmonize \
   -H "Content-Type: application/json" \
   -d '{"jsonList":["<json1>", "<json2>"], "ids":"iJhz", "destinationIds":"100"}'
```

---

## Web UI

Visit [http://localhost:4000](http://localhost:4000) to use the interactive web interface. You can paste multiple JSON sources, filter by hotel or destination ID, and view the harmonized result.

---

## 🧾 License

This project is licensed under the MIT License.  
See the [`LICENSE`](./LICENSE) file for full details.
