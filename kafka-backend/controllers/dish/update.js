const db = require("../../models/db");
const Restaurant = db.restaurants;

function handle_request(req, callback) {
    Restaurant.updateOne({"dishes.dish_ID": req.dish_ID},{
        $set: {
            'dishes.$.dish_name': req.dish_name,
            'dishes.$.main_ingredients': req.main_ingredients,
            'dishes.$.price': req.price,
            'dishes.$.dish_image': req.dish_image
        }
    }, {useFindAndModify: false})
    .then(data => {
    if (!data) {
        callback(null, {message: `Cannot update Tutorial with id=${req.restaurant_ID}. Maybe Tutorial was not found!`})
    } else callback(null, { message: "Tutorial was updated successfully." });
    })
    .catch(err => {
    callback(null, {
        message: "Error updating Tutorial with id=" + req.restaurant_ID
    });
    });
}

exports.handle_request = handle_request;