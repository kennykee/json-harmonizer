const roomMapping = {
  url: ["link"],
  description: ["description"],
};

const siteMapping = {
  url: ["link"],
  description: ["caption"],
};

const amenityMapping = {
  name: ["name"],
  type: ["type"],
};

const arraySubSchemas = {
  "images.rooms": roomMapping,
  "images.site": siteMapping,
  "amenities.room": amenityMapping,
};

export default arraySubSchemas;
