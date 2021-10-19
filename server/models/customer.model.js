const conn = require("./db.js");

// constructor
const Customer = function (customer) {
  this.nickname = customer.nickname,
  this.first_name = customer.first_name,
  this.last_name = customer.last_name,
  this.about = customer.about,
  this.email_id = customer.email_id,
  this.pass = customer.pass,
  this.phone_number = customer.phone_number,
  this.dob = customer.dob,
  this.profile_picture = customer.profile_picture
};

Customer.create = (newCustomer, result) => {
  conn.query("INSERT INTO customers SET ?", newCustomer, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log("created customer: ", { customer_id: res.insertId, ...newCustomer });
    result(null, { customer_id: res.insertId, ...newCustomer });
  });
};

Customer.authenticateCreds = (email_id, pass, result) => {
  conn.query(`SELECT * FROM customers WHERE email_id = "${email_id}" and pass="${pass}"`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found customer: ", res[0]);
      result(null, res[0]);
      return;
    }

    // not found Customer with the id
    result({ kind: "not_found" }, null);
  });
};

Customer.findById = (customerId, result) => {
  conn.query(`SELECT * FROM customers AS c INNER JOIN customer_addresses AS a ON c.customer_ID = a.customer_ID WHERE c.customer_ID = ${customerId}`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found customer: ", res[0]);
      result(null, res[0]);
      return;
    }

    // not found Customer with the id
    result({ kind: "not_found" }, null);
  });
};

Customer.getAll = result => {
  conn.query("SELECT * FROM customers", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log("customers: ", res);
    result(null, res);
  });
};

Customer.updateById = (customer, result) => {
  conn.query(
    "UPDATE customers SET nickname = ?, first_name = ?, last_name = ?, about = ?, phone_number = ?, dob = ?, profile_picture = ? WHERE customer_ID = ?",
    [customer.nickname, customer.first_name, customer.last_name, customer.about, customer.phone_number, customer.dob, customer.profile_picture, customer.customer_ID],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        // not found Customer with the id
        result({ kind: "not_found" }, null);
        return;
      }
      result(null, {customer });
    }
  );
};

Customer.remove = (id, result) => {
  conn.query("DELETE FROM customers WHERE customer_id = ?", id, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    if (res.affectedRows == 0) {
      // not found Customer with the id
      result({ kind: "not_found" }, null);
      return;
    }

    console.log("deleted customer with id: ", id);
    result(null, res);
  });
};

Customer.removeAll = result => {
  conn.query("DELETE FROM customers", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log(`deleted ${res.affectedRows} customers`);
    result(null, res);
  });
};

module.exports = Customer;