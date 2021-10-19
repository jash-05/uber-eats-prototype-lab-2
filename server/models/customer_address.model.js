const conn = require("./db.js");

// CustomerAddresses model constructor
const CustomerAddress = function (customerAddress) {
    this.customer_ID = customerAddress.customer_ID,
    this.line1 = customerAddress.line1,
    this.line2 = customerAddress.line2,
    this.city = customerAddress.city,
    this.state_name = customerAddress.state_name,
    this.zipcode = customerAddress.zipcode,
    this.address_type = customerAddress.address_type
}

// Create function
CustomerAddress.createAddressForCustomer = (newAddress, result) => {
  conn.query("INSERT INTO customer_addresses SET ?", newAddress, (err, res) => {
    if (err) {
      console.log(`Error while creating new customer address entry: ${err}`);
      result(err, null);
      return;
    }
    console.log("Created new entry into customer addresses table: ", { address_ID: res.insertId, ...newAddress });
    result(null, { address_ID: res.insertId, ...newAddress });
  });
};

// Read function
CustomerAddress.getAddressesForCustomer = (customer_ID, result) => {
  conn.query(`SELECT * FROM customer_addresses WHERE customer_ID = ${customer_ID}`, (err, res) => {
    if (err) {
      console.log(`Error while trying to fetch addresses for customer_ID ${customer_ID}: ${err}`);
      result(null, err);
      return;
    }
    console.log(`Fetched addresses for customer ${customer_ID}: ${res}`);
    result(null, res);
  });
};

CustomerAddress.getCityFromCustomerID = (customer_ID, result) => {
  conn.query(`SELECT city FROM customer_addresses WHERE address_type="primary" AND customer_ID = ${customer_ID}`, (err, res) => {
    if (err) {
      console.log(`Error while trying to fetch addresses for customer_ID ${customer_ID}: ${err}`);
      result(null, err);
      return;
    }
    console.log(`Fetched addresses for customer ${customer_ID}: ${res}`);
    result(null, res);
  });
};

CustomerAddress.updateById = (customer, result) => {
  conn.query(
    "UPDATE customer_addresses SET line1 = ?, line2 = ?, city = ?, state_name = ?, zipcode = ? WHERE customer_ID = ?",
    [customer.line1, customer.line2, customer.city, customer.state_name, parseInt(customer.zipcode), customer.customer_ID],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        // not found restaurant with the id
        result({ kind: "not_found" }, null);
        return;
      }
      result(null, {customer: customer});
    }
  );
};

// Delete function
CustomerAddress.removeAddressForCustomer = (customer_ID, address_type, result) => {
    conn.query(`DELETE FROM customer_addresses WHERE customer_ID = ${customer_ID} AND address_type = "${address_type}"`, (err, res) => {
      if (err) {
        console.log(`Error while trying to delete addresss with address_type ${address_type} for customer ${customer_ID}: ${err}`);
        result(null, err);
        return;
      }
      if (res.affectedRows == 0) {
        result({ err_type: "not_found" }, null);
        return;
      }
      console.log(`Deleted address with address type ${address_type} for customer ${customer_ID}`);
      result(null, res);
    });
};

module.exports = CustomerAddress;