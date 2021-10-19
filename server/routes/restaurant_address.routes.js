module.exports = app => {
    const restaurant_addresses = require("../controllers/restaurant_address.controller.js");
  
    // Create a new restaurant address
    app.post("/restaurantAddress", restaurant_addresses.create);
  
    // Retrieve all restaurant addresses
    app.get("/restaurantAddress/:restaurant_ID", restaurant_addresses.findOne);

    // Update restaurant address
    app.put('/restaurantAddress', restaurant_addresses.update);
  };