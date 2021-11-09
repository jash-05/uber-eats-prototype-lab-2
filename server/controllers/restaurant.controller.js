const kafka = require("../kafka/client");
const db = require("../models/db");
const Restaurant = db.restaurants;

exports.create = (req, res) => {
    if (!req.body) {
      res.status(400).send({ message: "Content can not be empty!" });
      return;
    }
    kafka.make_request('restaurants.create', req.body, function(err, data){
      console.log(data);
      if (err) {
        res.status(500).send({
          message: "Some error occured while creating the customer"
        })
      } else {
        req.session.user = {
          user_type: "restaurant",
          id: data.restaurant_ID
        }
        res.cookie('restaurant', data.restaurant_ID, {maxAge: 9000000, httpOnly: false, path : '/'});
        res.send(data);
      }
    })
  };

const prioritizeRestaurantsByCity = (data, city) => {
    if (!city){
        return data
    }
    restaurantsList = []
    for (let i=0;i<data.length;i++){
        if (data[i]['address']['city'].toLowerCase() === city.toLowerCase()) {
            restaurantsList.push(data[i])
        }
    }
    for (let i=0;i<data.length;i++){
      if (data[i]['address']['city'].toLowerCase() != city.toLowerCase()) {
          restaurantsList.push(data[i])
      }
  }
  return restaurantsList
}

exports.findAll = (req, res) => {
      kafka.make_request('restaurants.findAll', req.body, function(err, data){
        console.log(data);
        if (err) {
          res.status(500).send({
            message: "Some error occured while creating the customer"
          })
        } else {
          res.send(prioritizeRestaurantsByCity(data, req.query.city));
        }
      })
  };

exports.findSearchedItems = (req, res) => {
    kafka.make_request('restaurants.findSearchedItems', req.query, function(err, data){
      console.log(data);
      if (err) {
        res.status(500).send({
          message: "Some error occured while creating the customer"
        })
      } else {
        res.send(prioritizeRestaurantsByCity(data, req.query.city));
      }
    })
};

exports.authenticate = (req, res) => {
  kafka.make_request('restaurants.authenticate', req.body, function(err, data){
    console.log(data);
    if (err) {
      res.status(500).send({
        message: "Some error occured while creating the customer"
      })
    } else {
          if (!data)
            res.status(404).send({ message: "Not found customer with email " + req.body.email_id });
          else {
            req.session.user = {
                user_type: "restaurant",
                id: data.restaurant_ID
            }
            res.cookie('restaurant',data.restaurant_ID,{maxAge: 9000000, httpOnly: false, path : '/'});
            res.send(data);
          }
    }
  })
};

exports.findOne = (req, res) => {
  kafka.make_request('restaurants.findOne', req.params, function(err, data){
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

exports.update = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!"
    });
  }
  kafka.make_request('restaurants.update', req.body, function(err, data){
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