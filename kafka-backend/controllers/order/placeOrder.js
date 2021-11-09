const db = require("../../models/db");
const Order = db.orders;
const Customer = db.customers;
const Restaurant = db.restaurants;
const MOMENT= require( 'moment' );
const {v4: uuidv4} = require('uuid');

async function handle_request(msg, callback) {
    const customerDetails = await Customer.findOne({customer_ID: msg.customer_ID})
    const restaurantDetails = await Restaurant.findOne({restaurant_ID: msg.restaurant_ID})
    const orderDetails = {
        order_ID: uuidv4(),
        order_status: 'placed',
        order_type: msg.order_type,
        order_placed_timestamp: MOMENT().format( 'YYYY-MM-DD  HH:mm:ss.000' ),
        total_amount: msg.total_amount,
        order_items: msg.order_items,
        customer_info: {
            customer_ID: customerDetails.customer_ID,
            first_name: customerDetails.first_name,
            last_name: customerDetails.last_name,
            phone_number: customerDetails.phone_number,
            address: customerDetails.addresses.find(x => x.address_ID === msg.address_ID)
        },
        restaurant_info: {
            restaurant_ID: restaurantDetails.restaurant_ID,
            restaurant_name: restaurantDetails.restaurant_name,
            address: restaurantDetails.address
        }
    }
    const order = new Order(orderDetails);

    order
      .save(order)
      .then(data => {
        callback(null, data);
      })
      .catch(err => {
        callback(null, err)
      });
}

exports.handle_request = handle_request;