const db = require("../../models/db");
const Order = db.orders;

function handle_request(query, callback) {
    let condition = {
        "customer_info.customer_ID": query.customer_ID
      }
      if (query.filter !== "all") {
        condition['order_status'] = query.filter
      }
      Order.find(condition)
        .skip(parseInt(query.toSkip))
        .limit(parseInt(query.limit))
        .then(data => {
            callback(null, data)
        })
        .catch(err => {
            callback(null, err)
        });
}

exports.handle_request = handle_request;