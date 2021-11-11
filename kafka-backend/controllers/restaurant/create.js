const db = require("../../models/db");
const Restaurant = db.restaurants;
const {v4: uuidv4} = require('uuid');

function handle_request(msg, callback) {
    const restaurant = new Restaurant({
      ...msg,
      restaurant_ID: uuidv4()
    });
    restaurant
      .save(restaurant)
      .then(data => {
        console.log(data)
        callback(null, data)
      })
      .catch(err => {
        callback(null, err)
      });
}

exports.handle_request = handle_request;