const db = require("../../models/db");
const Restaurant = db.restaurants;
const {v4: uuidv4} = require('uuid');

function handle_request(req, callback) {
    console.log(req)
    let dish_dict = {
        dish_ID: uuidv4(),
        dish_name: req.dish_name,
        category_ID: req.category_ID,
        main_ingredients: req.main_ingredients,
        restaurant_ID: req.restaurant_ID,
        price: req.price,
        about: req.about,
        dish_image: req.dish_image
    }
    Restaurant.updateOne({restaurant_ID: req.restaurant_ID}, {$push: {dishes: dish_dict}}, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        callback(null, {
          message: `Cannot update Tutorial with id=${req.restaurant_ID}. Maybe Tutorial was not found!`
        });
      } else callback(null, { message: "Tutorial was updated successfully." });
    })
    .catch(err => {
      callback(null, {
        message: "Error updating Tutorial with id=" + req.restaurant_ID
      });
    });
}

exports.handle_request = handle_request;