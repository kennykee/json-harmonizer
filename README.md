pipeline

1. lowercase all source key to harmonize source case
2. remove underscore to harmonize into alphanumeric
3. map to schema
4. merge and replace only if non null

assumption,

1. the json property's value is equivalent for different source. for example
   source 1 = "Facilities": ["Pool", "WiFi ", "Aircon"]
   source 2 = "Facilities": ["Pool Table", "Wireless ", "Aircond"]
