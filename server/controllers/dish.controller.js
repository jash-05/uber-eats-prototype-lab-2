const kafka = require("../kafka/client");
const db = require("../models/db");
const Restaurant = db.restaurants;

exports.create = (req, res) => {
	// Validate request
	if (!req.body) {
		res.status(400).send({
			message: "Content can not be empty!",
		});
	}
	kafka.make_request("lab3.dishes.create", req.body, function (err, data) {
		console.log(data);
		if (err) {
			res.status(500).send({
				message: "Some error occured while creating the customer",
			});
		} else {
			res.send(data);
		}
	});
};

exports.findAll = (req, res) => {
	kafka.make_request("lab3.dishes.findAll", req.query, function (err, data) {
		console.log(data);
		if (err) {
			res.status(500).send({
				message: "Some error occured while creating the customer",
			});
		} else {
			res.send(data);
		}
	});
};

exports.findById = (req, res) => {
	kafka.make_request(
		"lab3.dishes.findById",
		req.params,
		function (err, data) {
			console.log(data);
			if (err) {
				res.status(500).send({
					message: "Some error occured while creating the customer",
				});
			} else {
				res.send(
					data.dishes.find((x) => x.dish_ID === req.params.dish_ID)
				);
			}
		}
	);
};

exports.update = (req, res) => {
	// Validate request
	if (!req.body) {
		res.status(400).send({
			message: "Content can not be empty!",
		});
	}
	console.log(req.body);
	kafka.make_request("lab3.dishes.update", req.body, function (err, data) {
		console.log(data);
		if (err) {
			res.status(500).send({
				message: "Some error occured while creating the customer",
			});
		} else {
			res.send(data);
		}
	});
};
