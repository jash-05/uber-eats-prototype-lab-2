const db = require("../../models/db");
const Customer = db.customers;
const Restaurant = db.restaurants;

function handle_request(msg, callback) {
    Customer.findOne({customer_ID: msg.customer_ID}, 'favourites')
    .then(data => {
        Restaurant.find({restaurant_ID: {$in: data.favourites.map((fav) => fav.restaurant_ID)}})
        .then(restaurants_data => {
            callback(null, restaurants_data)
        })
        .catch(err => {
            callback(null, err)
        })
    })
    .catch(err => {
        callback(null, err)
    });
}

exports.handle_request = handle_request;