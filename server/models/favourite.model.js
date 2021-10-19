const conn = require("./db.js");

// Favourites model constructor
const Favourite = function (favourite) {
    this.customer_ID = favourite.customer_ID,
    this.restaurant_ID = favourite.restaurant_ID
}

// Create function
Favourite.createFavouriteForCustomer = (newFavourite, result) => {
  conn.query("INSERT INTO favourites SET ?", newFavourite, (err, res) => {
    if (err) {
      console.log(`Error while creating new favourites entry: ${err}`);
      result(err, null);
      return;
    }
    console.log("Created new entry into favourites table: ", { favourite_id: res.insertId, ...newFavourite });
    result(null, { favourite_id: res.insertId, ...newFavourite });
  });
};

// Read function (with condition)
Favourite.getFavouritesForCustomer = (customer_ID, result) => {
  conn.query(`
    SELECT f.restaurant_ID, r.restaurant_name, r.cover_image, a.city 
    FROM favourites as f 
    LEFT JOIN restaurants as r 
      ON f.restaurant_ID = r.restaurant_ID
    LEFT JOIN restaurant_addresses AS a
      ON f.restaurant_ID = a.restaurant_ID
    WHERE f.customer_ID = ${customer_ID};
  `,
  (err, res) => {
    if (err) {
      console.log(`Error while trying to fetch favourites for customer_ID ${customer_ID}: ${err}`);
      result(null, err);
      return;
    }
    console.log(`Fetches favourites for customer ${customer_ID}: ${res}`);
    result(null, res);
  });
};

// Delete function (single row)
Favourite.removeRestaurantFromFavourites = (customer_ID, restaurant_ID, result) => {
    conn.query(`DELETE FROM favourites WHERE customer_ID = ${customer_ID} AND restaurant_ID = ${restaurant_ID}`, (err, res) => {
      if (err) {
        console.log(`Error while trying to delete restaurant ${restaurant_ID} for customer ${customer_ID}: ${err}`);
        result(null, err);
        return;
      }
      if (res.affectedRows == 0) {
        result({ err_type: "not_found" }, null);
        return;
      }
      console.log(`Deleted favourite restaurant ${restaurant_ID} for customer ${customer_ID}`);
      result(null, res);
    });
};

module.exports = Favourite;