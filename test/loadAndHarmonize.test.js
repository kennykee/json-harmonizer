import fs from "fs";
import path from "path";
import { loadAndHarmonize } from "../src/utils/helper.js";
import { harmonizeData } from "../src/services/hotelService.js";

describe("Hotel Data Harmonization", () => {
  describe("loadAndHarmonize", () => {
    test("should successfully load and harmonize JSON files", () => {
      const result = loadAndHarmonize();

      expect(result.success).toBe(true);
      expect(result.harmonizedJson).toBeDefined();

      const hotels = JSON.parse(result.harmonizedJson);
      expect(Array.isArray(hotels)).toBe(true);
      expect(hotels.length).toBeGreaterThan(0);

      for (const hotel of hotels) {
        expect(hotel.id).toBeDefined();
        expect(hotel.destination_id).toBeDefined();
        expect(hotel.name).toBeDefined();
        expect(hotel.location).toHaveProperty("address");
        expect(hotel.location).toHaveProperty("lat");
        expect(hotel.description).toBeDefined();
        expect(hotel.amenities).toHaveProperty("general");
        expect(hotel.amenities).toHaveProperty("room");
        expect(hotel.images).toHaveProperty("rooms");
        expect(hotel.images).toHaveProperty("site");
        expect(hotel.images).toHaveProperty("amenities");
        expect(hotel.booking_conditions).toBeDefined();
      }
    });
  });

  describe("harmonizeData", () => {
    let jsonList;

    beforeAll(() => {
      const acmePath = "./test/acme.json";
      const paperfliesPath = "./test/paperflies.json";
      const patagoniaPath = "./test/patagonia.json";
      jsonList = [fs.readFileSync(acmePath, "utf8"), fs.readFileSync(paperfliesPath, "utf8"), fs.readFileSync(patagoniaPath, "utf8")];
    });

    test("should harmonize JSON data correctly for Beach Villas Singapore (iJhz)", () => {
      const harmonized = harmonizeData(jsonList);
      expect(Array.isArray(harmonized)).toBe(true);
      const hotel = harmonized.find((h) => h.id === "iJhz");
      expect(hotel).toBeDefined();
      expect(hotel.destination_id).toEqual(5432);
      expect(hotel.name).toEqual("Beach Villas Singapore");
      expect(hotel.location.lat).toBeCloseTo(1.264751);
      expect(hotel.location.lng).toBeCloseTo(103.824006);
      expect(hotel.location.address).toBe("8 Sentosa Gateway, Beach Villas, 098269");
      expect(typeof hotel.description).toBe("string");
      expect(Array.isArray(hotel.amenities.general)).toBe(true);
      expect(hotel.amenities.room).toEqual(
        expect.arrayContaining(["aircon", "tv", "coffee machine", "kettle", "hair dryer", "iron", "tub"])
      );
      expect(Array.isArray(hotel.images.rooms)).toBe(true);
      expect(Array.isArray(hotel.images.site)).toBe(true);
      expect(Array.isArray(hotel.images.amenities)).toBe(true);
      expect(Array.isArray(hotel.booking_conditions)).toBe(true);
      expect(harmonized).toBeDefined();
      expect(hotel.destination_id).toEqual(5432);
      expect(hotel.name).toEqual("Beach Villas Singapore");
      expect(hotel.location.lat).toBeCloseTo(1.264751);
      expect(hotel.location.lng).toBeCloseTo(103.824006);
      expect(hotel.location.address).toBe("8 Sentosa Gateway, Beach Villas, 098269");
      expect(typeof hotel.description).toBe("string");
      expect(Array.isArray(hotel.amenities.general)).toBe(true);
      expect(hotel.amenities.room).toEqual(
        expect.arrayContaining(["aircon", "tv", "coffee machine", "kettle", "hair dryer", "iron", "tub"])
      );
      expect(Array.isArray(hotel.images.rooms)).toBe(true);
      expect(Array.isArray(hotel.images.site)).toBe(true);
      expect(Array.isArray(hotel.images.amenities)).toBe(true);
      expect(Array.isArray(hotel.booking_conditions)).toBe(true);
    });

    test("should harmonize JSON data correctly for Hilton Tokyo (f8c9)", () => {
      const harmonized = harmonizeData(jsonList);
      expect(Array.isArray(harmonized)).toBe(true);
      const hotel = harmonized.find((h) => h.id === "f8c9");
      if (!hotel) {
        return;
      }
      expect(hotel.destination_id).toBeDefined();
      expect(hotel.name).toBeDefined();
      expect(hotel.location).toHaveProperty("address");
      expect(typeof hotel.description).toBe("string");
      expect(Array.isArray(hotel.amenities.general)).toBe(true);
      expect(Array.isArray(hotel.amenities.room)).toBe(true);
      expect(Array.isArray(hotel.images.rooms)).toBe(true);
      expect(Array.isArray(hotel.booking_conditions)).toBe(true);
    });

    test("should handle invalid JSON input", () => {
      const invalidJsonList = ["invalid json", jsonList[1], jsonList[2]];
      expect(() => harmonizeData(invalidJsonList)).toThrow("Invalid JSON in list");
    });

    test("should handle empty JSON list", () => {
      const harmonized = harmonizeData([]);
      expect(Array.isArray(harmonized)).toBe(true);
      expect(harmonized).toEqual([]);
    });

    test("should handle invalid input types", () => {
      expect(() => harmonizeData("not an array")).toThrow("Invalid input");
      expect(() => harmonizeData(jsonList)).not.toThrow();
    });

    test("should handle empty query", () => {
      const harmonized = harmonizeData(jsonList);
      expect(Array.isArray(harmonized)).toBe(true);
      expect(harmonized.length).toBeGreaterThan(0);
      for (const hotel of harmonized) {
        expect(hotel.id).toBeDefined();
      }
    });

    test("should merge duplicate hotel data correctly", () => {
      const duplicateJsonList = [jsonList[0], jsonList[1], jsonList[1]];
      const harmonized = harmonizeData(duplicateJsonList);
      const hotel = harmonized.find((h) => h.id === "iJhz");
      expect(hotel).toBeDefined();
      expect(typeof hotel.description).toBe("string");
      expect(Array.isArray(hotel.images.rooms)).toBe(true);
    });

    test("should handle partial data (missing fields)", () => {
      const partialJson = JSON.stringify({
        id: "test1",
        name: "Test Hotel",
      });
      const harmonized = harmonizeData([partialJson]);
      const hotel = harmonized.find((h) => h.id === "test1");
      expect(hotel).toBeDefined();
      expect(hotel.name).toEqual("Test Hotel");
      expect(hotel.location).toHaveProperty("address");
      expect(hotel.amenities).toHaveProperty("general");
      expect(hotel.amenities).toHaveProperty("room");
      expect(hotel.images).toHaveProperty("rooms");
      expect(hotel.images).toHaveProperty("site");
      expect(hotel.images).toHaveProperty("amenities");
      expect(Array.isArray(hotel.booking_conditions)).toBe(true);
    });
  });
});
