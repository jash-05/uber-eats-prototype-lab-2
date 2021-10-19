const Customer = require("../models/customer.model.js");

// Create and Save a new Customer
exports.create = (req, res) => {
    // Validate request
    if (!req.body) {
      res.status(400).send({
        message: "Content can not be empty!"
      });
    }

    let customer_dict = {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email_id: req.body.email_id,
        pass: req.body.pass,
        country: req.body.country,
        phone_number: req.body.phone_number,
        dob: req.body.dob,
        profile_picture: req.body.profile_picture
    };

    console.log(customer_dict);
  
    // Save Customer in the database
    Customer.create(customer_dict, (err, data) => {  
      if (err)
        res.status(500).send({
          message:
            err.message || "Some error occurred while creating the Customer."
        });
      else {
        res.cookie('cookie',req.body.email_id,{maxAge: 900000, httpOnly: false, path : '/'});
        req.session.user = "Logged in";
        res.send(data)
      };
    });
  };

// Retrieve all Customers from the database.
exports.findAll = (req, res) => {
    Customer.getAll((err, data) => {
      if (err)
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving customers."
        });
      else res.send(data);
    });
  };

// Authenticate a single Customer with email_ID and password
exports.authenticate = (req, res) => {
  console.log(req.body)
  Customer.authenticateCreds(req.body.email_id, req.body.pass, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found Customer with email_id: ${req.body.email_id} and pass: ${req.body.pass}.`
        });
      } else {
        res.status(500).send({
          message: "Error retrieving Customer with email_id " + req.body.email_id
        });
      }
    } else {
      req.session.user = {
          user_type: "customer",
          id: data.customer_ID
      }
      res.cookie('customer',data.customer_ID,{maxAge: 9000000, httpOnly: false, path : '/'});
      res.send(data)
    };
  });
};

// Find a single Customer with a customerId
exports.findOne = (req, res) => {
    console.log(req.params)
    Customer.findById(req.params.customerId, (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Not found Customer with id ${req.params.customerId}.`
          });
        } else {
          res.status(500).send({
            message: "Error retrieving Customer with id " + req.params.customerId
          });
        }
      } else res.send(data);
    });
  };

// Update a Customer identified by the customerId in the request
exports.update = (req, res) => {
  console.log("Updating customer with following info:")
  console.log(req.body)
    if (!req.body) {
      res.status(400).send({
        message: "Content can not be empty!"
      });
    }
    Customer.updateById(req.body,
      (err, data) => {
        if (err) {
          if (err.kind === "not_found") {
            res.status(404).send({
              message: `Not found Customer with id ${req.body.customerId}.`
            });
          } else {
            res.status(500).send({
              message: "Error updating Customer with id " + req.body.customerId
            });
          }
        } else res.send(data);
      }
    );
  };
// Delete a Customer with the specified customerId in the request
exports.delete = (req, res) => {
    Customer.remove(req.params.customerId, (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Not found Customer with id ${req.params.customerId}.`
          });
        } else {
          res.status(500).send({
            message: "Could not delete Customer with id " + req.params.customerId
          });
        }
      } else res.send({ message: `Customer was deleted successfully!` });
    });
  };

// Delete all Customers from the database.
exports.deleteAll = (req, res) => {
    Customer.removeAll((err, data) => {
      if (err)
        res.status(500).send({
          message:
            err.message || "Some error occurred while removing all customers."
        });
      else res.send({ message: `All Customers were deleted successfully!` });
    });
  };