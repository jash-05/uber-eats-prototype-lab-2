const conn = require("./db.js");

// constructor
const Dish = function (dish) {
    this.dish_name = dish.dish_name,
    this.category_ID = dish.category_ID,
    this.main_ingredients = dish.main_ingredients,
    this.restaurant_ID = dish.restaurant_ID,
    this.price = dish.price,
    this.about = dish.about,
    this.dish_image = dish.dish_image
}

Dish.create = (newDish, result) => {
    conn.query("INSERT INTO dishes SET ?", newDish, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        console.log("created dish with dish_ID: ", { dish_id: res.insertId, ...newDish});
        result(null, { dish_id: res.insertId, ...newDish });
    });
};

Dish.getAll = (restaurant_ID, result) => {
    conn.query(`SELECT * FROM dishes WHERE restaurant_ID = ${restaurant_ID}`, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        }

        console.log("dishes: ", res);
        result(null, res)
    });
};

Dish.findById = (dish_ID, result) => {
  conn.query(`SELECT * FROM dishes WHERE dish_ID = ${dish_ID}`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found dish: ", res[0]);
      result(null, res[0]);
      return;
    }

    // not found restaurant with the id
    result({ kind: "not_found" }, null);
  });
};


Dish.updateById = (dish, result) => {
    conn.query(
      "UPDATE dishes SET dish_name = ?, main_ingredients = ?, price = ?, dish_image = ? WHERE dish_ID = ?",
      [dish.dish_name, dish.main_ingredients, dish.price, dish.dish_image, dish.dish_ID],
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
        result(null, { dish });
      }
    );
  };

 
module.exports = Dish;