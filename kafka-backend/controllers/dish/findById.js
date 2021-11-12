const db = require("../../models/db");
const Restaurant = db.restaurants;

function handle_request(msg, callback) {
    Restaurant.findOne({'dishes.dish_ID': msg.dish_ID})
    .then(data => {
      if (!data)
        callback(null, { message: "Not found Tutorial with id " + msg.dish_ID });
      else callback(null, data);
    })
    .catch(err => {
        callback(null, { message: "Error retrieving Tutorial with id=" + msg.dish_ID })
    });
}

exports.handle_request = handle_request;