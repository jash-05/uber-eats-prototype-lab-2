module.exports = app => {
    const restaurants = require("../controllers/restaurant.controller.js");

    app.post("/restaurants", restaurants.create);

    app.get("/restaurants", restaurants.findAll);

    app.post("/restaurant", restaurants.authenticate);

    app.get("/restaurants/:restaurantId", restaurants.findOne);

    app.put("/restaurants/:restaurantId", restaurants.update);

    app.get('/searchRestaurants', restaurants.findSearchedItems);
};