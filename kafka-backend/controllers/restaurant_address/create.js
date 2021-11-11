const db = require("../../models/db");
const Restaurant = db.restaurants;

function handle_request(req, callback) {
    console.log(req)
    let address_dict = {
        'line1': req.address_line_1,
        'line2': req.address_line_2,
        'city': req.city,
        'state_name': req.state,
        'zipcode': req.zip
    };
    Restaurant.updateOne({restaurant_ID: req.restaurant_ID}, {address: address_dict}, { useFindAndModify: false })
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