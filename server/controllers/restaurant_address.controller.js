const db = require("../models/db");
const Restaurant = db.restaurants;

exports.create = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  // Create object of input variables
  let address_dict = {
      'line1': req.body.address_line_1,
      'line2': req.body.address_line_2,
      'city': req.body.city,
      'state_name': req.body.state,
      'zipcode': req.body.zip
  };

  Restaurant.updateOne({restaurant_ID: req.body.restaurant_ID}, {address: address_dict}, { useFindAndModify: false })
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

exports.findOne = (req, res) => {
  Restaurant.findOne({restaurant_ID: req.params.restaurant_ID}, 'restaurant_ID address')
    .then(data => {
      if (!data)
        res.status(404).send({ message: "Not found Tutorial with id " + req.params.customerId });
      else res.send(data);
    })
    .catch(err => {
      res
        .status(500)
        .send({ message: "Error retrieving Tutorial with id=" + req.params.customerId });
    });
};