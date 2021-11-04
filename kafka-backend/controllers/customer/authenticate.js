const db = require("../../models/db");
const Customer = db.customers;

function handle_request(msg, callback) {
    Customer.findOne({
        "email_id": msg.email_id,
        "pass": msg.pass
    })
      .then(data => {
        callback(null, data)
      })
      .catch(err => {
        callback(null, err)
      });
}

exports.handle_request = handle_request;