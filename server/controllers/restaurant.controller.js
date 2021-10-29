const db = require("../models/db");
const Restaurant = db.restaurants;

exports.create = (req, res) => {
    if (!req.body) {
      res.status(400).send({ message: "Content can not be empty!" });
      return;
    }
  
    const restaurant = new Restaurant(req.body);
  
    restaurant
      .save(restaurant)
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while creating the Customer."
        });
      });
  };

const prioritizeRestaurantsByCity = (data, city) => {
    if (!city){
        return data
    }
    restaurantsList = []
    for (let i=0;i<data.length;i++){
        if (data[i]['address']['city'].toLowerCase() === city.toLowerCase()) {
            restaurantsList.push(data[i])
        }
    }
    for (let i=0;i<data.length;i++){
      if (data[i]['address']['city'].toLowerCase() != city.toLowerCase()) {
          restaurantsList.push(data[i])
      }
  }
  return restaurantsList
}

exports.findAll = (req, res) => {
    Restaurant.find()
      .then(data => {
        res.send(prioritizeRestaurantsByCity(data, req.query.city));
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving customer."
        });
      });
  };

exports.findSearchedItems = (req, res) => {
    if (req.query.searchQuery.toLowerCase() === "delivery" || req.query.searchQuery.toLowerCase() === "pickup") {
        let filter = {}
        if (req.query.searchQuery.toLowerCase() === "delivery"){
            filter = {
                "delivery": true
            }
        } else {
            filter = {
                "pickup": true
            }
        }
        Restaurant.find(filter)
        .then(data => {
            res.send(prioritizeRestaurantsByCity(data, req.query.city))
        })
        .catch(err => {
          res.status(500).send({
            message:
              err.message || "Some error occurred while retrieving customer."
          });
        });
    }
    else {
        Restaurant.find({
            $or: [
                {
                    "restaurant_name": {
                        $regex: req.query.searchQuery,
                        $options: 'i'
                    }
                },
                {
                    "dishes.dish_name": {
                        $regex: req.query.searchQuery,
                        $options: 'i'
                    }
                },
                {
                    'address.city': {
                        $regex: req.query.searchQuery,
                        $options: 'i'
                    }
                }
            ]
        })
        .then(data => {
          res.send(data);
        })
        .catch(err => {
          res.status(500).send({
            message:
              err.message || "Some error occurred while retrieving customer."
          });
        });
    }
  };
  
exports.authenticate = (req, res) => {
    Restaurant.find({
      "email_id": req.body.email_id,
      "pass": req.body.pass
    })
      .then(data => {
        if (!data.length)
          res.status(404).send({ message: "Not found customer with email " + req.body.email_id });
        else res.send(data);
      })
      .catch(err => {
        res
          .status(500)
          .send({ message: "Error retrieving customer with email=" + req.body.email_id });
      });
  };

exports.findOne = (req, res) => {
    Restaurant.findOne({restaurant_ID: req.params.restaurantId})
      .then(data => {
        if (!data)
          res.status(404).send({ message: "Not found Tutorial with id " + req.params.restaurantId });
        else res.send(data);
      })
      .catch(err => {
        res
          .status(500)
          .send({ message: "Error retrieving Tutorial with id=" + req.params.restaurantId });
      });
  };

exports.update = (req, res) => {
    if (!req.body) {
      return res.status(400).send({
        message: "Data to update can not be empty!"
      });
    }
  
    Restaurant.updateOne({restaurant_ID: req.body.restaurant_ID}, req.body, { useFindAndModify: false })
      .then(data => {
        if (!data) {
          res.status(404).send({
            message: `Cannot update Tutorial with id=${req.body.restaurant_ID}. Maybe Tutorial was not found!`
          });
        } else res.send({ message: "Tutorial was updated successfully." });
      })
      .catch(err => {
        res.status(500).send({
          message: "Error updating Tutorial with id=" + req.body.restaurant_ID
        });
      });
  };