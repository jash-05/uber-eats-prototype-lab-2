const RestaurantAddress = require("../models/restaurant_address.model.js");

// Create and Save a new Address
exports.create = (req, res) => {
    // Validate request
    if (!req.body) {
      res.status(400).send({
        message: "Content can not be empty!"
      });
    }

    // Create object of input variables
    let address_dict = {
        'restaurant_ID': req.body.restaurant_ID,
        'line1': req.body.address_line_1,
        'line2': req.body.address_line_2,
        'city': req.body.city,
        'state_name': req.body.state,
        'zipcode': req.body.zip
    };

    // Save Restaurant address in the database
    RestaurantAddress.createAddressForRestaurant(address_dict, (err, data) => {  
      if (err)
        res.status(500).send({
            message: err.message || "Some error occurred while creating the restaurant address."
        });
      else res.send(data);
    });
  };

// Retrieve all Favourites from the database.
exports.findOne = (req, res) => {
    RestaurantAddress.getAddressForRestaurant(req.params.restaurant_ID, (err, data) => {
      if (err)
        res.status(500).send({
          message: err.message || "Some error occurred while retrieving the restaurant address."
        });
      else res.send(data);
    });
  };

exports.update = (req, res) => {
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }
    RestaurantAddress.updateById(
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
