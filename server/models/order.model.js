const e = require("express");
const conn = require("./db.js");

// constructor
const Order = function (order) {
    this.order_ID = order.order_ID,
    this.restaurant_ID = order.restaurant_ID,
    this.customer_ID = order.customer_ID,
    this.address_ID = order.address_ID,
    this.order_status = order.order_status,
    this.total_amount = order.total_amount
}

Order.getOrderInfo = (customer_ID, result) => {
    conn.query(`SELECT * FROM orders WHERE customer_ID = ${customer_ID} AND order_status = "in-cart";`, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        }

        console.log("order_info: ", res);
        result(null, res)
    });
};

Order.getAllOrderItems = (order_ID, result) => {
    conn.query(`SELECT * FROM order_details AS o INNER JOIN dishes as d ON o.dish_ID = d.dish_ID WHERE order_ID = ${order_ID}`, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        }

        console.log("dishes: ", res);
        result(null, res)
    });
};

Order.deleteCurrentCart = (customer_ID, result) => {
    conn.query(`DELETE FROM orders WHERE customer_ID = ${customer_ID} AND order_status = "in-cart"`, (err, res) => {
      if (err) {
        console.log(`Error while trying to delete order for customer ${customer_ID}: ${err}`);
        result(null, err);
        return;
      }
      if (res.affectedRows == 0) {
        result({ err_type: "not_found" }, null);
        return;
      }
      console.log(`Deleted cart order for customer ${customer_ID}`);
      result(null, res);
    });
};

Order.createOrder = (newOrder, result) => {
    conn.query("INSERT INTO orders SET ?", newOrder, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        console.log("created order with order_ID: ", { order_ID: res.insertId, ...newOrder});
        result(null, { order_ID: res.insertId, ...newOrder });
    });
};


Order.upsertOrderItem = (newOrderItem, result) => {
    conn.query(`SELECT * FROM order_details WHERE order_ID=${newOrderItem.order_ID} AND dish_ID=${newOrderItem.dish_ID}`, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }
        console.log(res);
        if (res.length == 0) {
            conn.query(`INSERT INTO order_details SET ?`, newOrderItem, (err, res) => {
                if(err) {
                    console.log("error: ", err);
                    result(err, null);
                    return;
                }
                console.log("created new order item with order_item_ID: ", {order_item_ID: res.insertId, ...newOrderItem});
                result(null, { order_item_ID: res.insertId, ...newOrderItem});
            });
        } else if (res.length > 1) {
            result(`Multiple occurences present in order details table where order_ID=${newOrderItem.order_ID} and dish_ID=${newOrderItem.dish_ID}`, null)
            return;
        } else {
            conn.query(`UPDATE order_details SET quantity=${newOrderItem.quantity} WHERE order_ID=${newOrderItem.order_ID} AND dish_ID=${newOrderItem.dish_ID}`, (err, res) => {
                if (err) {
                    console.log("error: ", err);
                    result(err, null);
                    return; 
                }
                console.log("Updated order details table");
                result(null, res);
            })
        }
    });
};


Order.getAllOrdersByCustomer = (customer_ID, result) => {
    conn.query(`
    SELECT o.order_ID, o.customer_ID, o.address_ID, o.order_status, o.total_amount, o.order_placed_timestamp, o.order_type, GROUP_CONCAT(od.dish_ID) AS dish_IDs, GROUP_CONCAT(d.dish_name) AS dish_names, GROUP_CONCAT(od.quantity) AS dish_quantities, GROUP_CONCAT(d.price) AS dish_prices, ca.address_type, r.restaurant_ID, r.restaurant_name, ra.line1, ra.line2, ra.city, ra.state_name, ra.zipcode
	FROM orders AS o
	LEFT JOIN order_details AS od
		ON o.order_ID = od.order_ID
	LEFT JOIN dishes AS d
		ON od.dish_ID = d.dish_ID
	LEFT JOIN customers AS c
		ON o.customer_ID = c.customer_ID
	LEFT JOIN customer_addresses AS ca
		ON o.address_ID = ca.address_ID
	LEFT JOIN restaurants AS r
		ON o.restaurant_ID = r.restaurant_ID
	LEFT JOIN restaurant_addresses AS ra
		ON r.restaurant_ID = ra.restaurant_ID
	WHERE o.customer_ID = ${customer_ID} AND NOT order_status = "in-cart"
    GROUP BY o.order_ID;
    `,
    (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        }
        console.log("order: ",res);
        result(null, res)
    })
}

Order.getAllOrdersByRestaurant = (restaurant_ID, result) => {
    conn.query(`
        SELECT o.order_ID, o.customer_ID, o.address_ID, o.order_status, o.total_amount, GROUP_CONCAT(od.dish_ID) AS dish_IDs, GROUP_CONCAT(d.dish_name) AS dish_names, GROUP_CONCAT(od.quantity) AS dish_quantities, GROUP_CONCAT(d.price) AS dish_prices, c.first_name, c.last_name, c.phone_number, ca.line1, ca.line2, ca.city, ca.state_name, ca.zipcode, ca.address_type 
        FROM orders as o
        LEFT JOIN order_details as od
            ON o.order_ID = od.order_ID
        LEFT JOIN dishes as d
            ON od.dish_ID = d.dish_ID
        LEFT JOIN customers as c
            ON o.customer_ID = c.customer_ID
        LEFT JOIN customer_addresses as ca
            ON o.address_ID = ca.address_ID
        WHERE o.restaurant_ID = ${restaurant_ID} AND NOT order_status = "in-cart"
        GROUP BY o.order_ID;
    `,
    (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        }
        console.log("order: ",res);
        result(null, res)
    })
}
 
Order.placeOrder = (orderDetails, result) => {
    conn.query(`UPDATE orders SET total_amount = ${orderDetails.total_amount}, address_ID = ${orderDetails.address_ID}, order_status = "placed", order_placed_timestamp = "${orderDetails.order_placed_timestamp}", order_type="${orderDetails.order_type}" WHERE order_ID=${orderDetails.order_ID};`, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        }
        console.log("order: ", res);
        result(null, res);
    })
}

Order.updateOrderStatus = (orderDetails, result) => {
    conn.query(`UPDATE orders SET order_status="${orderDetails.order_status}"  WHERE order_ID=${orderDetails.order_ID};`, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        }
        console.log("order: ", res);
        result(null, res);
    })
}

module.exports = Order;