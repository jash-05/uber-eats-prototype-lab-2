const db = require("../../models/db");
const Customer = db.customers;

function handle_request(msg, callback) {
    const customer = new Customer(msg);
    customer
      .save(customer)
      .then(data => {
        callback(null, data)
      })
      .catch(err => {
        callback(null, err)
      });
}

exports.handle_request = handle_request;