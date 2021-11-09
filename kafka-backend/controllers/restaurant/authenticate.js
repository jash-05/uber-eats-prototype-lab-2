const db = require("../../models/db");
const Restaurant = db.restaurants;

function handle_request(msg, callback) {
    Restaurant.findOne({
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