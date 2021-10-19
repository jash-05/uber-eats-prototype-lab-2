const e = require("express");
const Restaurant = require("../models/restaurant.model.js");
const RestaurantAddress = require("../models/restaurant_address.model.js");

exports.create = (req, res) => {
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }
    console.log(req.body);
    let restaurant_dict = {
        restaurant_name: req.body.restaurant_name,
        owner_name: req.body.owner_name,
        email_id: req.body.email_id,
        pass: req.body.pass,
        country: req.body.country,
        phone_number: req.body.phone_number,
        vegetarian: req.body.vegetarian,
        non_vegetarian: req.body.non_vegetarian,
        vegan: req.body.vegan,
        delivery: req.body.delivery,
        pickup: req.body.pickup,
        cover_image: req.body.cover_image,
        about: req.body.about,
        opening_time: req.body.opening_time,
        closing_time: req.body.closing_time
    }

    Restaurant.create(restaurant_dict, (err, data) => {
        if (err)
        res.status(500).send({
            message:
            err.message || "Some error occured while creating the restaurant"
        });
        else {
            console.log(data)
            req.session.user = {
                user_type: "restaurant",
                id: data.restaurant_ID
            }
            res.cookie('restaurant',data.restaurant_ID,{maxAge: 9000000, httpOnly: false, path : '/'});
            res.send(data)
        }
    });
};

exports.findAll = (req, res) => {
    console.log(req.query);
    let all_food_options = ["vegetarian", "non_vegetarian", "vegan"];
    let all_delivery_options = ["delivery", "pickup"];
    let selected_food_options = [];
    let selected_delivery_option = "";
    for (let key in req.query){
        if (all_food_options.includes(key) && req.query[key]=="true") {
            selected_food_options.push(`${key}=1`);
        } else if (all_delivery_options.includes(key) && req.query[key]=="true") {
            selected_delivery_option = key;
        }
    }
    let food_option_string = `${selected_food_options.join(" OR ")}`;
    let query_string = "SELECT * FROM restaurants AS r INNER JOIN restaurant_addresses AS a ON r.restaurant_ID = a.restaurant_ID WHERE";
    if (food_option_string){
        query_string = `${query_string} (${food_option_string}) AND (${selected_delivery_option}=1)`;
    } else {
        query_string = `${query_string} ${selected_delivery_option}=1`;
    }
    console.log(query_string);
    let query_string_with_location = ""
    query_string_with_location += `${query_string} AND city = "${req.query.city}"`
    query_string_with_location += " UNION "
    query_string_with_location += `${query_string} AND NOT city = "${req.query.city}"`
    console.log(query_string_with_location)
    Restaurant.getAll(query_string_with_location,(err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving restaurants!"
            });
        else res.send(data);
    });
};

exports.findSearchedItems = (req, res) => {
    console.log(req.query);
    let query_string_with_location = "";
    if (req.query.searchQuery.toLowerCase() === "delivery" || req.query.searchQuery.toLowerCase() === "pickup") {
        let query_string = "SELECT * FROM restaurants AS r INNER JOIN restaurant_addresses AS a ON r.restaurant_ID = a.restaurant_ID WHERE ";
        if (req.query.searchQuery.toLowerCase() === "delivery") {
            query_string += "delivery = 1"
        } else {
            query_string += "pickup = 1"
        }
        query_string_with_location += `${query_string} AND city = "${req.query.city}"`
        query_string_with_location += " UNION "
        query_string_with_location += `${query_string} AND NOT city = "${req.query.city}";`
    } else {
        let query_string = 
        `
            SELECT 
            DISTINCT a.restaurant_ID, a.restaurant_name, a.cover_image, a.city   
            FROM    
                ( SELECT r.restaurant_ID, r.restaurant_name, r.cover_image, ra.city, d.dish_name    
                    FROM restaurants AS r
                    INNER JOIN restaurant_addresses AS ra
                        ON r.restaurant_ID = ra.restaurant_ID
                    LEFT JOIN dishes AS d      
                        ON r.restaurant_ID = d.restaurant_ID   
                ) AS a     
            WHERE    
            (a.restaurant_name LIKE '%${req.query.searchQuery}%'   
            OR a.dish_name LIKE '%${req.query.searchQuery}%')
        `
        query_string_with_location += `${query_string} AND city = "${req.query.city}"`
        query_string_with_location += " UNION "
        query_string_with_location += `${query_string} AND NOT city = "${req.query.city}";`
    }
    console.log(query_string_with_location);
    // res.send(query_string_with_location)
    // return;
    Restaurant.getAll(query_string_with_location,(err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving restaurants!"
            });
        else {
            console.log(data);
            res.send(data);
        };
    });
}

// Authenticate a single Restaurant with email_ID and password
exports.authenticate = (req, res) => {
    console.log(req.body)
    Restaurant.authenticateCreds(req.body.email_id, req.body.pass, (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Not found Restaurant with email_id: ${req.body.email_id} and pass: ${req.body.pass}.`
          });
        } else {
          res.status(500).send({
            message: "Error retrieving Restaurant with email_id " + req.body.email_id
          });
        }
      } else {
          req.session.user = {
              user_type: "restaurant",
              id: data.restaurant_ID
          }
          res.cookie('restaurant',data.restaurant_ID,{maxAge: 9000000, httpOnly: false, path : '/'});
          res.send(data)
        };
    });
  };

exports.findOne = (req, res) => {
    Restaurant.findById(req.params.restaurantId, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `Not found restaurant with id: ${req.params.restaurantId}`
                });
            } else {
                res.status(500).send({
                    message: `Error retrieving restaurant with id: ${req.params.restaurantId}`
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
    Restaurant.updateById(
        req.body, (err, data) => {
            if (err) {
                if (err.kind === "not_found") {
                    res.status(404).send({
                        message: `Not found restaurant with id: ${req.body.restaurant_ID}`
                    });
                } else {
                    res.status(500).send({
                        message: `Error updating restaurant with id: ${req.body.restaurant_ID}`
                    });
                }
            } else res.send(data)
        }
    );
};

