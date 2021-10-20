const db = require("../models/db");
const Customer = db.customers;

exports.create = (req, res) => {
  if (!req.body) {
    res.status(400).send({ message: "Content can not be empty!" });
    return;
  }

  const customer = new Customer(req.body);

  customer
    .save(customer)
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

exports.findAll = (req, res) => {
  Customer.find()
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

exports.authenticate = (req, res) => {
  Customer.find({
    "email_id": req.body.email_id,
    "pass": req.body.pass
  })
    .then(data => {
      if (!data)
        res.status(404).send({ message: "Not found customer with email " + req.body.email_id });
      else res.send(data);
    })
    .catch(err => {
      res
        .status(500)
        .send({ message: "Error retrieving customer with email=" + req.body.email_id });
    });
};

exports.findOne = (req, res) => {
  Customer.find({customer_ID: req.params.customerId})
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

exports.update = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!"
    });
  }

  Customer.updateOne({customer_ID: req.params.customerId}, req.body, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update Tutorial with id=${req.params.customerId}. Maybe Tutorial was not found!`
        });
      } else res.send({ message: "Tutorial was updated successfully." });
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Tutorial with id=" + req.params.customerId
      });
    });
};