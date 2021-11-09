const db = require("../../models/db");
const Restaurant = db.restaurants;

function handle_request(msg, callback) {
    if (msg.searchQuery.toLowerCase() === "delivery" || msg.searchQuery.toLowerCase() === "pickup") {
        let filter = {}
        if (msg.searchQuery.toLowerCase() === "delivery"){
            filter = {
                "delivery": true
            }
        } else {
            filter = {
                "pickup": true
            }
        }
        Restaurant.find(filter)
        .then(data => {
            callback(null, data)
        })
        .catch(err => {
            callback(null, err)
        });
    }
    else {
        Restaurant.find({
            $or: [
                {
                    "restaurant_name": {
                        $regex: msg.searchQuery,
                        $options: 'i'
                    }
                },
                {
                    "dishes.dish_name": {
                        $regex: msg.searchQuery,
                        $options: 'i'
                    }
                },
                {
                    'address.city': {
                        $regex: msg.searchQuery,
                        $options: 'i'
                    }
                }
            ]
        })
        .then(data => {
          callback(null, data)
        })
        .catch(err => {
          callback(null, err)
        });
    }
}

exports.handle_request = handle_request;