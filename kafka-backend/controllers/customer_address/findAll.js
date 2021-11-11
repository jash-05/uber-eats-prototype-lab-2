const db = require("../../models/db");
const Customer = db.customers;

function handle_request(msg, callback) {
    Customer.findOne({customer_ID: msg.customer_ID}, 'addresses')
    .then(data => {
        callback(null, data)
    })
    .catch(err => {
        callback(null, err)
    });
}

exports.handle_request = handle_request;