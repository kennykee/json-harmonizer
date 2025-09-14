const schema = {
  id: "id",
  hotelid: "id",
  destinationid: "destination_id",
  name: "name",
  hotelname: "name",
  latitude: "location.lat",
  lat: "location.lat",
  longitude: "location.lng",
  lng: "location.lng",
  "location.address": "location.address",
  "location.country": "location.country",
  address: {
    key: "location.address",
    transform: (value, obj) => {
      if (typeof value === "string" && value.trim() !== "") {
        return obj.postalcode ? `${value.trim()}, ${obj.postalcode}` : value.trim();
      }
      return obj.postalcode ? obj.postalcode : "";
    },
  },
  city: "location.city",
  country: "location.country",
  description: "description",
  details: "description",
  info: "description",
  facilities: {
    key: "amenities.general",
    transform: (value) =>
      Array.isArray(value) ? value.filter(Boolean).map((item) => (typeof item === "string" ? item.trim().toLowerCase() : "")) : [],
  },
  amenitiesgeneral: {
    key: "amenities.general",
    transform: (value) =>
      Array.isArray(value) ? value.filter(Boolean).map((item) => (typeof item === "string" ? item.trim().toLowerCase() : "")) : [],
  },
  amenitiesroom: {
    key: "amenities.room",
    transform: (value) =>
      Array.isArray(value) ? value.filter(Boolean).map((item) => (typeof item === "string" ? item.trim().toLowerCase() : "")) : [],
  },
  amenities: {
    key: "amenities.room",
    transform: (value) =>
      Array.isArray(value) ? value.filter(Boolean).map((item) => (typeof item === "string" ? item.trim().toLowerCase() : "")) : [],
  },
  imagesrooms: {
    key: "images.rooms",
    transform: (value) =>
      value
        ? value.map((item) => ({
            link: item.link || item.url,
            description: item.caption || item.description,
          }))
        : [],
  },
  imagessite: {
    key: "images.site",
    transform: (value) =>
      value
        ? value.map((item) => ({
            link: item.link || item.url,
            description: item.caption || item.description,
          }))
        : [],
  },
  imagesamenities: {
    key: "images.amenities",
    transform: (value) =>
      value
        ? value.map((item) => ({
            link: item.url,
            description: item.description,
          }))
        : [],
  },
  "amenities.general[]": "amenities.general[]",
  "amenities.room[]": "amenities.room[]",
  "images.rooms[]": {
    key: "images.rooms[]",
    transform: (item) => ({
      url: item.link || item.url, // support either link or url
      description: item.caption || item.description,
    }),
  },
  "images.site[]": {
    key: "images.site[]",
    transform: (item) => ({
      url: item.link || item.url,
      description: item.caption || item.description,
    }),
  },
  "images.amenities[]": {
    key: "images.amenities[]",
    transform: (item) => ({
      url: item.link || item.url,
      description: item.caption || item.description,
    }),
  },
  "bookingconditions[]": {
    key: "booking_conditions",
    transform: (value) => value || [],
  },
};

export default schema;
