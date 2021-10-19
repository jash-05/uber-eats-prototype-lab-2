module.exports = app => {
    const dishes = require("../controllers/dish.controller.js");

    app.post("/dish", dishes.create);

    app.get("/dish", dishes.findAll);

    app.get("/dish/:dish_ID", dishes.findById);

    app.put("/dish", dishes.update);
}