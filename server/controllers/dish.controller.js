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
    let dish_dict = {
        dish_name: req.body.dish_name,
        category_ID: req.body.category_ID,
        main_ingredients: req.body.main_ingredients,
        restaurant_ID: req.body.restaurant_ID,
        price: req.body.price,
        about: req.body.about,
        dish_image: req.body.dish_image
    }

  Restaurant.updateOne({restaurant_ID: req.body.restaurant_ID}, {$push: {dishes: dish_dict}}, { useFindAndModify: false })
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

exports.findAll = (req, res) => {
    Restaurant.findOne({restaurant_ID: req.query.restaurant_ID}, 'restaurant_ID dishes')
      .then(data => {
        if (!data)
          res.status(404).send({ message: "Not found Tutorial with id " + req.query.restaurant_ID });
        else res.send(data);
      })
      .catch(err => {
        res
          .status(500)
          .send({ message: "Error retrieving Tutorial with id=" + req.query.restaurant_ID });
      });
  };

exports.findById = (req, res) => {
    Restaurant.findOne({'dishes.dish_ID': req.params.dish_ID})
      .then(data => {
        if (!data)
          res.status(404).send({ message: "Not found Tutorial with id " + req.query.restaurant_ID });
        else res.send(data.dishes.find(x => x.dish_ID === req.params.dish_ID));
      })
      .catch(err => {
        res
          .status(500)
          .send({ message: "Error retrieving Tutorial with id=" + req.query.restaurant_ID });
      });
  };

exports.update = (req, res) => {
    // Validate request
    if (!req.body) {
      res.status(400).send({
        message: "Content can not be empty!"
      });
    }
    console.log(req.body)
    Restaurant.updateOne({"dishes.dish_ID": req.body.dish_ID},{
        $set: {
            'dishes.$.dish_name': req.body.dish_name,
            'dishes.$.main_ingredients': req.body.main_ingredients,
            'dishes.$.price': req.body.price,
            'dishes.$.dish_image': req.body.dish_image
        }
    }, {useFindAndModify: false})
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update Tutorial with id=${req.body.dish_ID}. Maybe Tutorial was not found!`
        });
      } else res.send({ message: "Tutorial was updated successfully." });
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Tutorial with id=" + req.body.dish_ID
      });
    });
  };
