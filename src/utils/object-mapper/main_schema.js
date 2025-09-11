const hotelMappingFull = {
  id: ["id", "hotel_id"],
  destinationId: ["destinationid", "destination", "destination_id"],
  name: ["name", "hotel_name"],
  description: ["description", "info", "details"],

  location: {
    lat: ["latitude", "lat"],
    lng: ["longitude", "lng"],
    address: ["address", "location.address"],
    city: ["city"],
    country: ["country", "location.country"],
    postalCode: ["postalcode"],
  },

  amenities: {
    general: ["facilities", "amenities", "amenities.general"],
    room: ["amenities.room"],
  },

  images: {
    rooms: "images.rooms",
    site: "images.site",
    amenities: "images.amenities",
  },

  bookingConditions: ["booking_conditions"],
};

export default hotelMappingFull;
