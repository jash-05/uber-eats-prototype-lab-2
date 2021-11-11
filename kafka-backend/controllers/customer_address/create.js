const db = require("../../models/db");
const Customer = db.customers;

function handle_request(req, callback) {
    let address_dict = {
        'line1': req.address_line_1,
        'line2': req.address_line_2,
        'city': req.city,
        'state_name': req.state,
        'zipcode': req.zip,
        'address_type': req.address_type
    };
    Customer.updateOne({customer_ID: req.customer_ID}, {$push: {addresses: address_dict}}, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        callback(null, {
          message: `Cannot update Tutorial with id=${req.customer_ID}. Maybe Tutorial was not found!`
        });
      } else callback(null, { message: "Tutorial was updated successfully." });
    })
    .catch(err => {
      callback(null, {
        message: "Error updating Tutorial with id=" + req.customer_ID
      });
    });
}

exports.handle_request = handle_request;
