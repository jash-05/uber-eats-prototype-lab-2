const db = require("../../models/db");
const Order = db.orders;

function handle_request(msg, callback) {
    console.log(msg);
    Order.updateOne({order_ID: msg.order_ID}, {order_status: msg.order_status} , { useFindAndModify: false })
    .then(data => {
        if (!data) {
            callback(null, {message: `Cannot update Tutorial with id=${msg.order_ID}. Maybe Tutorial was not found!`})
        } else callback(null, { message: "Tutorial was updated successfully." });
        })
        .catch(err => {
        callback(null, {
            message: "Error updating Tutorial with id=" + msg.order_ID
        });
    });
}



exports.handle_request = handle_request;
