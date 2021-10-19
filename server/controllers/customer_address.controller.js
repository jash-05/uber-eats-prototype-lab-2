const CustomerAddress = require("../models/customer_address.model.js");

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
        'customer_ID': req.body.customer_ID,
        'line1': req.body.address_line_1,
        'line2': req.body.address_line_2,
        'city': req.body.city,
        'state_name': req.body.state,
        'zipcode': req.body.zip,
        'address_type': req.body.address_type
    };

    // Save Favourite in the database
    CustomerAddress.createAddressForCustomer(address_dict, (err, data) => {  
      if (err)
        res.status(500).send({
            message: err.message || "Some error occurred while creating the Customer Address."
        });
      else res.send(data);
    });
  };

// Retrieve all Favourites from the database.
exports.findAll = (req, res) => {
    CustomerAddress.getAddressesForCustomer(req.params.customer_ID, (err, data) => {
      if (err)
        res.status(500).send({
          message: err.message || "Some error occurred while retrieving the customer addresses."
        });
      else res.send(data);
    });
  };

  exports.getCity = (req, res) => {
    CustomerAddress.getCityFromCustomerID(req.params.customer_ID, (err, data) => {
      if (err)
        res.status(500).send({
          message: err.message || "Some error occurred while retrieving the city name"
        });
      else {
        res.send(data[0])
      };
    });
  };


exports.update = (req, res) => {
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }
    CustomerAddress.updateById(
        req.body, (err, data) => {
            if (err) {
                if (err.kind === "not_found") {
                    res.status(404).send({
                        message: `Not found restaurant with id: ${req.body.restaurant_ID}`
                    });
                } else {
                    res.status(500).send({
                        message: `Error updating restaurant with id: ${req.body.restaurant_ID}`
                    });
                }
            } else res.send(data)
        }
    );
};

// Delete a Favourite with the specified customer_ID and restaurant_ID in the request
exports.delete = (req, res) => {
    CustomerAddress.removeAddressForCustomer(req.params.customer_ID, req.params.address_type,(err, data) => {
      if (err) {
        if (err.err_type === "not_found") {
          res.status(404).send({
            message: `Could not find address with address type ${req.params.address_type} for customer ${req.params.customer_ID}.`
          });
        } else {
          res.status(500).send({
            message: `Could not delete address with address type ${req.params.address_type} for customer ${req.params.customer_ID}.`
          });
        }
      } else res.send({ 
          message: `Address of address type ${req.params.address_type} was deleted successfully for customer ${req.params.customer_ID}!` });
    });
  };
