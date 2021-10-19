module.exports = app => {
    const customer_addresses = require("../controllers/customer_address.controller.js");
  
    // Create a new customer address
    app.post("/customerAddress", customer_addresses.create);
  
    // Retrieve all customer addresses
    app.get("/customerAddress/:customer_ID", customer_addresses.findAll);

    // Get city from customer ID
    app.get("/city/:customer_ID", customer_addresses.getCity);

    // Update customer address
    app.put('/customerAddress', customer_addresses.update);
    
    // Delete an address for a customer
    app.delete("/customerAddress/:customer_ID/:address_type", customer_addresses.delete);
  };