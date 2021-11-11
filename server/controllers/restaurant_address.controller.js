const kafka = require('../kafka/client');
const db = require("../models/db");
const Restaurant = db.restaurants;

exports.create = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }
  kafka.make_request('restaurant_addresses.create', req.body, function(err, data){
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

exports.findOne = (req, res) => {
  kafka.make_request('restaurant_addresses.findOne', req.params, function(err, data){
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