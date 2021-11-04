const db = require("../../models/db");
const Customer = db.customers;

function handle_request(req, callback) {
    Customer.updateOne({customer_ID: req.customer_ID}, {$pull: {addresses: {address_type: req.address_type}}}, { useFindAndModify: false })
    .then(data => {
    if (!data) {
        callback(null, {message: `Cannot update Tutorial with id=${req.customer_ID}. Maybe Tutorial was not found!`})
    } else callback(null, { message: "Tutorial was updated successfully." });
    })
    .catch(err => {
    callback(null, {
        message: "Error updating Tutorial with id=" + req.customer_ID
    });
    });
}

exports.handle_request = handle_request;
