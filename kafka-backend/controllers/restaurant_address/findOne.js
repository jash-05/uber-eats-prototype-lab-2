const db = require("../../models/db");
const Restaurant = db.restaurants;

function handle_request(msg, callback) {
    Restaurant.findOne({restaurant_ID: msg.restaurant_ID}, 'address')
    .then(data => {
        callback(null, data)
    })
    .catch(err => {
        callback(null, err)
    });
}

exports.handle_request = handle_request;