const { checkAuth } = require("../passport/passport");

module.exports = app => {
    const favourites = require("../controllers/favourite.controller.js");
  
    // Create a new favourite
    app.post("/favourites", checkAuth, favourites.create);
  
    // // Retrieve all favourites
    app.get("/favourites/:customer_ID", checkAuth, favourites.findAll);
  
    // Delete a favourite restaurant for a customer
    app.delete("/favourites/:customer_ID/:restaurant_ID", checkAuth, favourites.delete);
  };