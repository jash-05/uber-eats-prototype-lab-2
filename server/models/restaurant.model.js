module.exports = mongoose => {
  const Restaurant = mongoose.model(
    "restaurant",
    mongoose.Schema(
      {
        restaurant_ID: String,
        restaurant_name: String,
        owner_name: String,
        email_id: String,
        pass: String,
        country: String,
        phone_number: String,
        vegetarian: Boolean,
        non_vegetarian: Boolean,
        vegan: Boolean,
        delivery: Boolean,
        pickup: Boolean,
        cover_image: String,
        about: String,
        opening_time: String,
        closing_time: String,
        address: Object,
        dishes: Array
      },
      { timestamps: true }
    )
  );

  return Restaurant;
};


// const conn = require("./db.js");

// // constructor
// const Restaurant = function (restaurant) {
//     this.restaurant_name = restaurant.restaurant_name,
//     this.owner_name = restaurant.owner_name,
//     this.email_id = restaurant.email_id,
//     this.pass = restaurant.pass,
//     this.phone_number = restaurant.phone_number,
//     this.vegetarian = restaurant.vegetarian,
//     this.non_vegetarian = restaurant.non_vegetarian,
//     this.vegan = restaurant.vegan,
//     this.delivery = restaurant.delivery,
//     this.pickup = restaurant.pickup,
//     this.cover_image = restaurant.cover_image,
//     this.about = restaurant.about,
//     this.opening_time = restaurant.opening_time,
//     this.closing_time = restaurant.closing_time
// }

// Restaurant.create = (newRestaurant, result) => {
//     conn.query("INSERT INTO restaurants SET ?", newRestaurant, (err, res) => {
//         if (err) {
//             console.log("error: ", err);
//             result(err, null);
//             return;
//         }

//         console.log("created restaurant: ", { restaurant_id: res.insertId, ...newRestaurant});
//         result(null, { restaurant_ID: res.insertId, ...newRestaurant });
//     });
// };

// Restaurant.getAll = (query_string, result) => {
//     conn.query(query_string, (err, res) => {
//         if (err) {
//             console.log("error: ", err);
//             result(null, err);
//             return;
//         }

//         // console.log("restaurants: ", res);
//         result(null, res)
//     });
// };

// Restaurant.authenticateCreds = (email_id, pass, result) => {
//   conn.query(`SELECT * FROM restaurants WHERE email_id = "${email_id}" and pass="${pass}"`, (err, res) => {
//     if (err) {
//       console.log("error: ", err);
//       result(err, null);
//       return;
//     }

//     if (res.length) {
//       console.log("found restaurant: ", res[0]);
//       result(null, res[0]);
//       return;
//     }

//     // not found restaurant with the id
//     result({ kind: "not_found" }, null);
//   });
// };

// Restaurant.findById = (restaurant_id, result) => {
//     conn.query(`SELECT * FROM restaurants AS r INNER JOIN restaurant_addresses AS a ON r.restaurant_ID = a.restaurant_ID WHERE r.restaurant_ID = ${restaurant_id}`, (err, res) => {
//       if (err) {
//         console.log("error: ", err);
//         result(err, null);
//         return;
//       }
  
//       if (res.length) {
//         console.log("found restaurant: ", res[0]);
//         result(null, res[0]);
//         return;
//       }
  
//       // not found restaurant with the id
//       result({ kind: "not_found" }, null);
//     });
//   };

// Restaurant.updateById = (restaurant, result) => {
//     conn.query(
//       "UPDATE restaurants SET restaurant_name = ?, owner_name = ?, about = ?,phone_number = ?, vegetarian = ?, non_vegetarian = ?, vegan = ?, delivery = ?, pickup = ?, opening_time = ?, closing_time = ?, cover_image = ? WHERE restaurant_ID = ?",
//       [restaurant.restaurant_name, restaurant.owner_name, restaurant.about, restaurant.phone_number, restaurant.vegetarian, restaurant.non_vegetarian, restaurant.vegan, restaurant.delivery, restaurant.pickup, restaurant.opening_time, restaurant.closing_time,restaurant.cover_image, restaurant.restaurant_ID],
//       (err, res) => {
//         if (err) {
//           console.log("error: ", err);
//           result(null, err);
//           return;
//         }
  
//         if (res.affectedRows == 0) {
//           // not found restaurant with the id
//           result({ kind: "not_found" }, null);
//           return;
//         }
//         result(null, {restaurant});
//       }
//     );
//   };

 
// module.exports = Restaurant;