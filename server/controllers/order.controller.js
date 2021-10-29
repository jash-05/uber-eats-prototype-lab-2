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
    console.log(req.body)
    const customerDetails = await Customer.findOne({customer_ID: req.body.customer_ID})
    const restaurantDetails = await Restaurant.findOne({restaurant_ID: req.body.restaurant_ID})
    console.log(customerDetails)
    const orderDetails = {
        order_ID: uuidv4(),
        order_status: 'placed',
        order_type: req.body.order_type,
        order_placed_timestamp: MOMENT().format( 'YYYY-MM-DD  HH:mm:ss.000' ),
        total_amount: req.body.total_amount,
        order_items: req.body.order_items,
        customer_info: {
            customer_ID: customerDetails.customer_ID,
            first_name: customerDetails.first_name,
            last_name: customerDetails.last_name,
            phone_number: customerDetails.phone_number,
            address: customerDetails.addresses.find(x => x.address_ID === req.body.address_ID)
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
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while creating the Customer."
        });
      });
  };


exports.updateStatus = (req, res) => {
    if (!req.body) {
      return res.status(400).send({
        message: "Data to update can not be empty!"
      });
    }
  
    Order.updateOne({order_ID: req.body.order_ID}, {order_status: req.body.order_status} , { useFindAndModify: false })
      .then(data => {
        if (!data) {
          res.status(404).send({
            message: `Cannot update Tutorial with id=${req.body.order_ID}. Maybe Tutorial was not found!`
          });
        } else res.send({ message: "Tutorial was updated successfully." });
      })
      .catch(err => {
        res.status(500).send({
          message: "Error updating Tutorial with id=" + req.body.order_ID
        });
      });
  };

exports.fetchOrdersForRestaurant = (req, res) => {
    console.log(req.query)
    let condition = {
      "restaurant_info.restaurant_ID": req.query.restaurant_ID
    }
    if (req.query.filter !== "all") {
      condition['order_status'] = req.query.filter
    }
    Order.find(condition)
      .skip(parseInt(req.query.toSkip))
      .limit(parseInt(req.query.limit))
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving customer."
        });
      });
  };

exports.fetchPageNumbersForRestaurantOrders = async (req, res) => {
  console.log(req.query)
  let condition = {
    "restaurant_info.restaurant_ID": req.query.restaurant_ID
  }
  if (req.query.filter !== "all") {
    condition['order_status'] = req.query.filter
  }
  Order.find(condition)
    .then(data => {
      res.send({
        'numberOfPages': Math.ceil(data.length / req.query.limit)
      })
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving customer."
      });
    });
};

exports.fetchOrdersForCustomer = (req, res) => {
    Order.find({"customer_info.customer_ID": req.query.customer_ID})
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving customer."
        });
      });
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