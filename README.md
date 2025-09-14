# 🧩 JSON Harmonizer

JSON Harmonizer is a Node.js/Express web app and API that harmonizes hotel data from multiple JSON sources into a unified schema. It is designed to help you map, clean, and merge hotel data from different providers, making integration and analysis easier. Hosted on Digital Ocean with PM2 and deployed via GitHub Actions, it is developed using modern JavaScript (ES6) and smart workflows to ensure high code quality, performance, and reliability.

- **GitHub Link:** [JSON Harmonizer](https://github.com/kennykee/json-harmonizer)
- **Demo:** [jsonharmonizer.kennykee.com](https://jsonharmonizer.kennykee.com)

## ✔️ Features

- Harmonizes different JSON formats into a common hotel schema
- Cleans and normalizes keys (lowercase, removes underscores)
- Merges hotel data by ID, with smart overwrite rules
- Web UI for interactive harmonization and filtering
- REST API for programmatic access

---

## 🔧 Installation

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

## ♾️ Data Pipeline

1. Normalize keys – convert all source keys to lowercase to simplify schema mapping and ensure case-insensitive consistency.
2. Clean property names – remove underscores to retain only alphanumeric characters.
3. Map to schema – select and map only the properties defined in src/config/schema.js.
4. Flatten results – prepare the data structure for merging.
5. Merge selectively – update existing data only if the new value is non-null or a non-empty array; ignore empty strings and null.

---

## 🧩 System Design

### Overview

JSON Harmonizer is designed as a full-stack web application with a clear separation between the frontend (user interface) and backend (API and data processing). The system is optimized for harmonizing hotel data from multiple sources, both interactively via a web UI and programmatically via a REST API.

### Architecture

- **Frontend:**

  - Built with HTML, CSS, and JavaScript (jQuery and JSONEditor).
  - Allows users to paste or load multiple JSON sources, add more input boxes, and filter results by hotel or destination ID.
  - Sends user input to the backend via AJAX POST requests to the `/harmonize` endpoint.
  - Displays harmonized and filtered results using JSONEditor for easy viewing.

- **Backend:**

  - Node.js with Express serves static files and provides the REST API.
  - The `/harmonize` endpoint receives JSON data, processes it using the harmonization pipeline, and returns the harmonized hotel data.
  - Uses a schema mapping (`src/config/schema.js`) with object-mapper library to unify different source formats.
  - Cleans and normalizes keys, flattens arrays, and merges hotel records by ID with overwrite logic via lodash.

- **Data Flow:**
  1.  User provides multiple JSON sources via the UI or API.
  2.  The frontend sends the data to the backend `/harmonize` endpoint.
  3.  The backend processes the data:
      - Cleans and normalizes keys (lowercase, remove underscores)
      - Maps to a unified schema
      - Flattens nested arrays
      - Merges hotel records by ID, only overwriting with non-null or empty array values
      - Optionally filters by hotel or destination ID
  4.  The harmonized result is returned to the frontend or API client.
  5.  The frontend displays the result in a user-friendly JSON viewer.

### Extensibility

- The schema mapping can be easily updated in `src/config/schema.js` to support new data sources or fields.
- The merge logic can be customized in `src/services/hotelService.js`.
- The API can be extended to support additional endpoints or authentication if needed.

---

## 🛈 Assumptions

1. The JSON property values are considered equivalent across different sources. For example:
   - Source 1: `"Facilities": ["Pool", "WiFi ", "Aircon"]`
   - Source 2: `"Facilities": ["Pool Table", "Wireless ", "Aircond"]`
2. Another source's data can overwrite previous source data, assuming it provides the correct information.

---

## ⚡ API

### `POST /harmonize`

Harmonize and filter hotel data from multiple JSON sources.

- **Base URL:** Domain where the app is hosted (default: `http://localhost:4000`)
- **Request Body (application/json):**
  ```json
  {
    "jsonList": ["<JSON Data Source 1>", "<JSON Data Source 2>", "<JSON Data Source 3>"],
    "ids": "iJhz, SjyX, f8c9",
    "destinationIds": "100,200"
  }
  ```
  - _ids_ and _destinationIds_ are optional, comma-separated hotels id and destinations id
- **Response (application/json):**
  ```json
  {
    "success": true,
    "data": "[ ...harmonized hotels as JSON... ]"
  }
  ```
  ```json
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

## 🌐 Web UI

Visit [http://localhost:4000](http://localhost:4000) to use the interactive web interface. You can paste multiple JSON sources, filter by hotel or destination ID, and view the harmonized result.

---

## 🧾 License

This project is licensed under the MIT License.  
See the [`LICENSE`](./LICENSE) file for full details.

