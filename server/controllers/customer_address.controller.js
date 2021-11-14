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


exports.update = (req, res) => {
  console.log('UPDATING CUSTOMER ADDRESS')
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }
    Customer.update( {customer_ID: req.body.customer_ID, "addresses.address_type": "primary"}, {
      $set: {
        "addresses.$.line1": req.body.line1,
        "addresses.$.line2": req.body.line2,
        "addresses.$.city": req.body.city,
        "addresses.$.state_name": req.body.state_name,
        "addresses.$.zipcode": req.body.zipcode,
      }
    }, (err, data) => {
      if (err) {
        res.status(500).send({
          message: err.message || "Some error occurred while retrieving the customer addresses."
        })
      } else {
        res.send(data)
      }
    })
};

// Delete a Favourite with the specified customer_ID and restaurant_ID in the request

