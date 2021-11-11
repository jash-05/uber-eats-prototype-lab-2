const db = require("../../models/db");
const Restaurant = db.restaurants;

function handle_request(msg, callback) {
    console.log(msg);
    Restaurant.updateOne({restaurant_ID: msg.restaurant_ID}, msg, { useFindAndModify: false })
    .then(data => {
    if (!data) {
        callback(null, {message: `Cannot update Tutorial with id=${msg.restaurant_ID}. Maybe Tutorial was not found!`})
    } else callback(null, { message: "Tutorial was updated successfully." });
    })
    .catch(err => {
    callback(null, {
        message: "Error updating Tutorial with id=" + msg.restaurant_ID
    });
    });
}

exports.handle_request = handle_request;
