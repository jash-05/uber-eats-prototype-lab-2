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
        .then(data => {
          callback(null, {
            'numberOfPages': Math.ceil(data.length / query.limit)
          })
        })
        .catch(err => {
          callback(null, err)
        });
}

exports.handle_request = handle_request;
