const db = require("../../models/db");
const Restaurant = db.restaurants;

function handle_request(msg, callback) {
    const restaurant = new Restaurant(msg);
    restaurant
      .save(restaurant)
      .then(data => {
        callback(null, data)
      })
      .catch(err => {
        callback(null, err)
      });
}

exports.handle_request = handle_request;