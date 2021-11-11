const kafka = require('../kafka/client');
const db = require("../models/db");
const Customer = db.customers;

// Create and Save a new Address
exports.create = (req, res) => {
    // Validate request
    if (!req.body) {
      res.status(400).send({
        message: "Content can not be empty!"
      });
    }
    kafka.make_request('customer_addresses.create', req.body, function(err, data){
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

exports.delete = (req, res) => {
    // Validate request
    if (!req.body) {
      res.status(400).send({
        message: "Content can not be empty!"
      });
    }
    kafka.make_request('customer_addresses.delete', req.params, function(err, data){
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

exports.findAll = (req, res) => {
  kafka.make_request('customer_addresses.findAll', req.params, function(err, data){
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

// // Retrieve all Favourites from the database.
// exports.findAll = (req, res) => {
//     CustomerAddress.getAddressesForCustomer(req.params.customer_ID, (err, data) => {
//       if (err)
//         res.status(500).send({
//           message: err.message || "Some error occurred while retrieving the customer addresses."
//         });
//       else res.send(data);
//     });
//   };

//   exports.getCity = (req, res) => {
//     CustomerAddress.getCityFromCustomerID(req.params.customer_ID, (err, data) => {
//       if (err)
//         res.status(500).send({
//           message: err.message || "Some error occurred while retrieving the city name"
//         });
//       else {
//         res.send(data[0])
//       };
//     });
//   };


// exports.update = (req, res) => {
//     if (!req.body) {
//         res.status(400).send({
//             message: "Content can not be empty!"
//         });
//     }
//     CustomerAddress.updateById(
//         req.body, (err, data) => {
//             if (err) {
//                 if (err.kind === "not_found") {
//                     res.status(404).send({
//                         message: `Not found restaurant with id: ${req.body.restaurant_ID}`
//                     });
//                 } else {
//                     res.status(500).send({
//                         message: `Error updating restaurant with id: ${req.body.restaurant_ID}`
//                     });
//                 }
//             } else res.send(data)
//         }
//     );
// };

// Delete a Favourite with the specified customer_ID and restaurant_ID in the request

