const kafka = require('../kafka/client');
const db = require("../models/db");
const Order = db.orders;
const Customer = db.customers;
const Restaurant = db.restaurants;
const MOMENT= require( 'moment' );
const {v4: uuidv4} = require('uuid');

const getCustomerDetails = (customer_ID) => {
    Customer.find({customer_ID: customer_ID})
    .then(data => {
        return data[0]
    })
    .catch(err => {
        return {}
    });
};

exports.placeOrder = async (req, res) => {
    if (!req.body) {
      res.status(400).send({ message: "Content can not be empty!" });
      return;
    }
    kafka.make_request('orders.placeOrder', req.body, function(err, data){
      console.log(data);
      if (err) {
        res.status(500).send({
          message: "Some error occured while creating the customer"
        })
      } else {
        res.send(data);
      }
    })
};


exports.updateStatus = (req, res) => {
    if (!req.body) {
      return res.status(400).send({
        message: "Data to update can not be empty!"
      });
    }
    kafka.make_request('orders.updateStatus', req.body, function(err, data){
      console.log(data);
      if (err) {
        res.status(500).send({
          message: "Some error occured while creating the customer"
        })
      } else {
        res.send(data);
      }
    })
  };

exports.fetchOrdersForRestaurant = (req, res) => {
    console.log(req.query)
    kafka.make_request('orders.fetchOrdersForRestaurant', req.query, function(err, data){
      console.log(data);
      if (err) {
        res.status(500).send({
          message: "Some error occured while creating the customer"
        })
      } else {
        res.send(data);
      }
    })
};

exports.fetchPageNumbersForRestaurantOrders = async (req, res) => {
  console.log(req.query)
  kafka.make_request('orders.fetchpageNumbersForRestaurantOrders', req.query, function(err, data){
    console.log(data);
    if (err) {
      res.status(500).send({
        message: "Some error occured while creating the customer"
      })
    } else {
      res.send(data);
    }
  })
};

exports.fetchOrdersForCustomer = (req, res) => {
  console.log(req.query)
  kafka.make_request('orders.fetchOrdersForCustomer', req.query, function(err, data){
    console.log(data);
    if (err) {
      res.status(500).send({
        message: "Some error occured while creating the customer"
      })
    } else {
      res.send(data);
    }
  })
};

exports.fetchPageNumbersForCustomerOrders = async (req, res) => {
  console.log(req.query)
  kafka.make_request('orders.fetchpageNumbersForCustomerOrders', req.query, function(err, data){
    console.log(data);
    if (err) {
      res.status(500).send({
        message: "Some error occured while creating the customer"
      })
    } else {
      res.send(data);
    }
  })
};

// const e = require("express");
// const Order = require("../models/order.model.js");

// exports.getOrder = (req, res) => {
//     console.log(req.query);
//     Order.getOrderInfo(req.query.customer_ID, (err, data) => {
//         if (err)
//             res.status(500).send({
//                 message:
//                     err.message || "Some error occured while retrieving order!"
//             });
//         else {
//             if (data.length==0){
//                 res.send({});
//             } else {
//                 res.send(data[0])
//             }
//         } 
//     })
// }

// exports.getOrderItemsByOrderID = (req, res) => {
//     console.log(req.query);
//     Order.getAllOrderItems(req.query.order_ID, (err, data) => {
//         if (err)
//             res.status(500).send({
//                 message:
//                     err.message || "Some error occured while retrieving orders!"
//             });
//         else res.send({dishes: data});
//     })
// }

// exports.deleteInCartOrder = (req, res) => {
//     console.log(req.params)
//     Order.deleteCurrentCart(req.params.customer_ID, (err, data) => {
//         if (err) {
//           if (err.err_type === "not_found") {
//             res.status(200).send({
//               message: `Could not find cart order for customer ${req.params.customer_ID}.`
//             });
//           } else {
//             res.status(500).send({
//               message: `Could not delete order for customer ${req.params.customer_ID}.`
//             });
//           }
//         } else res.send({ 
//             message: `Cart order was deleted successfully for customer ${req.params.customer_ID}!` });
//       });
// };

// exports.addItem = (req, res) => {
//     console.log("Adding order item with following data: ")
//     console.log(req.body);
    
//     let order_item_dict = {
//         order_ID: req.body.order_ID,
//         dish_ID: req.body.dish_ID,
//         quantity: req.body.quantity
//     }

//     if (!req.body.order_ID) {
//         let order_dict = {
//             restaurant_ID: req.body.restaurant_ID,
//             customer_ID: req.body.customer_ID,
//             order_status: "in-cart"
//         }
//         Order.createOrder(order_dict, (err, data) => {
//             if(err)
//             res.status(500).send({
//                 message:
//                     err.message || "Some error occured while creating a new order"
//             });
//             else {
//                 console.log(data)
//                 order_item_dict["order_ID"] = data.order_ID
//                 Order.upsertOrderItem(order_item_dict, (err, data) => {
//                     if (err)
//                     res.status(500).send({
//                         message:
//                             err.message || "Some error occured while upserting order item"
//                     });
//                     else {
//                         res.send(data)
//                     }
//                 });
//             };
//         });
//     } else {
//         console.log("Order found, updating order item")
//         Order.upsertOrderItem(order_item_dict, (err, data) => {
//             if (err)
//             res.status(500).send({
//                 message:
//                     err.message || "Some error occured while upserting order item"
//             });
//             else {
//                 res.send(data)
//             }
//         });
//     }
// };

// exports.fetchOrdersForCustomer = (req, res) => {
//     console.log(req.query);
//     Order.getAllOrdersByCustomer(req.query.customer_ID, (err, data) => {
//         if (err)
//             res.status(500).send({
//                 message:
//                     err.message || "Some error occured while retrieving orders!"
//             });
//         else res.send(data);
//     })
// }

// exports.fetchOrdersForRestaurant = (req, res) => {
//     console.log(req.query);
//     Order.getAllOrdersByRestaurant(req.query.restaurant_ID, (err, data) => {
//         if (err)
//             res.status(500).send({
//                 message:
//                     err.message || "Some error occured while retrieving orders!"
//             });
//         else res.send(data);
//     })
// }

// exports.placeOrder = (req, res) => {
//     console.log("Placing order with the following params");
//     console.log(req.body)
//     let current_timestamp = MOMENT().format( 'YYYY-MM-DD  HH:mm:ss.000' );
//     let order_dict = {
//         order_ID: req.body.order_ID,
//         total_amount: req.body.total_amount,
//         address_ID: req.body.address_ID,
//         order_placed_timestamp: current_timestamp,
//         order_type: req.body.order_type
//     }
//     Order.placeOrder(order_dict, (err, data) => {
//         if(err){
//             res.status(500).send({
//                 message:
//                     err.message || "Some error occured while placing the order"
//             });
//         } else {
//             console.log(data);
//             res.send(data);
//         }
//     })
// }

// exports.updateStatus = (req, res) => {
//     console.log("Updating order status to: ", req.body)
//     Order.updateOrderStatus(req.body, (err, data) => {
//         if(err){
//             res.status(500).send({
//                 message:
//                     err.message || "Some error occured while updating the order status"
//             });
//         } else {
//             console.log(data);
//             res.send(data);
//         }
//     })
// }