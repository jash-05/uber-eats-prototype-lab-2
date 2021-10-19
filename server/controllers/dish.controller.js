const Dish = require("../models/dish.model.js");

exports.create = (req, res) => {
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }
    console.log(req.body);
    let dish_dict = {
        dish_name: req.body.dish_name,
        category_ID: req.body.category_ID,
        main_ingredients: req.body.main_ingredients,
        restaurant_ID: req.body.restaurant_ID,
        price: req.body.price,
        about: req.body.about,
        dish_image: req.body.dish_image
    }

    Dish.create(dish_dict, (err, data) => {
        if (err)
        res.status(500).send({
            message:
            err.message || "Some error occured while creating the dish"
        });
        else res.send(data);
    });
};

exports.findAll = (req, res) => {
    console.log(req.query);
    Dish.getAll(req.query.restaurant_ID, (err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving dishes!"
            });
        else res.send(data);
    });
};

exports.findById = (req, res) => {
    Dish.findById(req.params.dish_ID, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `Not found dish with id: ${req.params.dish_ID}`
                });
            } else {
                res.status(500).send({
                    message: `Error retrieving dish with id: ${req.params.dish_ID}`
                });
            }
        } else res.send(data);
    });
};

exports.update = (req, res) => {
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }
    Dish.updateById(
        req.body, (err, data) => {
            if (err) {
                if (err.kind === "not_found") {
                    res.status(404).send({
                        message: `Not found dish with id: ${req.body.dish_ID}`
                    });
                } else {
                    res.status(500).send({
                        message: `Error updating dish with id: ${req.body.dish_ID}`
                    });
                }
            } else res.send(data)
        }
    );
};

