const db = require("../../models/db");
const Customer = db.customers;

function handle_request(msg, callback) {
    Customer.findOne({customer_ID: msg.customerId})
    .then(data => {
      if (!data)
        callback(null, { message: "Not found Tutorial with id " + msg.customerId });
      else callback(null, data);
    })
    .catch(err => {
        callback(null, { message: "Error retrieving Tutorial with id=" + msg.customerId })
    });
}

exports.handle_request = handle_request;