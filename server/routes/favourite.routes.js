module.exports = app => {
    const favourites = require("../controllers/favourite.controller.js");
  
    // Create a new favourite
    app.post("/favourites", favourites.create);
  
    // // Retrieve all favourites
    app.get("/favourites/:customer_ID", favourites.findAll);
  
    // Delete a favourite restaurant for a customer
    app.delete("/favourites/:customer_ID/:restaurant_ID", favourites.delete);
  };