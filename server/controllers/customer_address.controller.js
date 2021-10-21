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

    // Create object of input variables
    let address_dict = {
        'line1': req.body.address_line_1,
        'line2': req.body.address_line_2,
        'city': req.body.city,
        'state_name': req.body.state,
        'zipcode': req.body.zip,
        'address_type': req.body.address_type
    };

    Customer.updateOne({customer_ID: req.body.customer_ID}, {$push: {addresses: address_dict}}, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update Tutorial with id=${req.body.customer_ID}. Maybe Tutorial was not found!`
        });
      } else res.send({ message: "Tutorial was updated successfully." });
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Tutorial with id=" + req.body.customer_ID
      });
    });
  };

  exports.delete = (req, res) => {
    // Validate request
    if (!req.body) {
      res.status(400).send({
        message: "Content can not be empty!"
      });
    }

    Customer.updateOne({customer_ID: req.params.customer_ID}, {$pull: {addresses: {address_type: req.params.address_type}}}, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update Tutorial with id=${req.params.customer_ID}. Maybe Tutorial was not found!`
        });
      } else res.send({ message: "Tutorial was updated successfully." });
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Tutorial with id=" + req.params.customer_ID
      });
    });
  };

exports.findAll = (req, res) => {
    Customer.findOne({customer_ID: req.params.customer_ID}, 'addresses')
      .then(data => {
        if (!data)
          res.status(404).send({ message: "Not found Tutorial with id " + req.params.customerId });
        else res.send(data);
      })
      .catch(err => {
        res
          .status(500)
          .send({ message: "Error retrieving Tutorial with id=" + req.params.customerId });
      });
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

