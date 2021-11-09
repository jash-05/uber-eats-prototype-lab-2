const db = require("../../models/db");
const Restaurant = db.restaurants;

function handle_request(msg, callback) {
    Restaurant.findOne({restaurant_ID: msg.restaurantId})
    .then(data => {
      if (!data)
        callback(null, { message: "Not found Tutorial with id " + msg.restaurantId });
      else callback(null, data);
    })
    .catch(err => {
        callback(null, { message: "Error retrieving Tutorial with id=" + msg.restaurantId })
    });
}

exports.handle_request = handle_request;