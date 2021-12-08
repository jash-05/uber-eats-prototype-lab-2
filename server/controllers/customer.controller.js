const kafka = require("../kafka/client");
const db = require("../models/db");
const Customer = db.customers;
const jwt = require("jsonwebtoken");
const secret = "cmpe_273_secret";
const { auth } = require("../passport/passport");
auth();

exports.create = (req, res) => {
	if (!req.body) {
		res.status(400).send({ message: "Content can not be empty!" });
		return;
	}
	kafka.make_request("lab3.customers.create", req.body, function (err, data) {
		console.log(data);
		if (err) {
			res.status(500).send({
				message: "Some error occured while creating the customer",
			});
		} else {
			const payload = { customer_ID: data.customer_ID };
			const token = jwt.sign(payload, secret, {
				expiresIn: 1008000,
			});
			const obj = {
				token: "JWT " + token,
				customer_ID: data.customer_ID,
			};
			res.status(200).send(obj);
			// req.session.user = {
			//   user_type: "customer",
			//   id: data.customer_ID
			// }
			// res.cookie('customer', data.customer_ID, {maxAge: 9000000, httpOnly: false, path : '/'});
			// res.send(data);
		}
	});
};

exports.findAll = (req, res) => {
	kafka.make_request(
		"lab3.customers.findAll",
		req.body,
		function (err, data) {
			console.log(data);
			if (err) {
				res.status(500).send({
					message: "Some error occured while creating the customer",
				});
			} else {
				res.send(data);
			}
		}
	);
};

exports.authenticate = (req, res) => {
	kafka.make_request(
		"lab3.customers.authenticate",
		req.body,
		function (err, data) {
			console.log(data);
			if (err) {
				res.status(500).send({
					message: "Some error occured while creating the customer",
				});
			} else {
				if (!data)
					res.status(404).send({
						message:
							"Not found customer with email " +
							req.body.email_id,
					});
				else {
					const payload = { customer_ID: data.customer_ID };
					const token = jwt.sign(payload, secret, {
						expiresIn: 1008000,
					});
					const obj = {
						token: "JWT " + token,
						customer_ID: data.customer_ID,
					};
					res.status(200).send(obj);
					// req.session.user = {
					//   user_type: "customer",
					//   id: data.customer_ID
					// }
					// res.cookie('customer', data.customer_ID, {maxAge: 9000000, httpOnly: false, path : '/'});
					// res.send(data);
				}
			}
		}
	);
};

exports.findOne = (req, res) => {
	kafka.make_request(
		"lab3.customers.findOne",
		req.params,
		function (err, data) {
			console.log(data);
			if (err) {
				res.status(500).send({
					message: "Some error occured while creating the customer",
				});
			} else {
				res.send(data);
			}
		}
	);
};

exports.update = (req, res) => {
	if (!req.body) {
		return res.status(400).send({
			message: "Data to update can not be empty!",
		});
	}
	const msg = {
		body: req.body,
		params: req.params,
	};
	kafka.make_request("lab3.customers.update", msg, function (err, data) {
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
