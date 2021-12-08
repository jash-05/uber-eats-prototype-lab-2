var connection = new require("./kafka/Connection");

const createCustomer = require("./controllers/customer/create.js");
const findAllCustomers = require("./controllers/customer/findAll.js");
const authenticateCustomer = require("./controllers/customer/authenticate.js");
const findCustomerById = require("./controllers/customer/findOne.js");
const updateCustomer = require("./controllers/customer/update.js");
const createCustomerAddress = require("./controllers/customer_address/create.js");
const deleteCustomerAddress = require("./controllers/customer_address/delete.js");
const findAllCustomerAddresses = require("./controllers/customer_address/findAll.js");
const createFavourite = require("./controllers/favourite/create.js");
const deleteFavourite = require("./controllers/favourite/delete.js");
const findAllFavourites = require("./controllers/favourite/findAll.js");
const createRestaurant = require("./controllers/restaurant/create.js");
const findAllRestaurants = require("./controllers/restaurant/findAll.js");
const findRestaurantById = require("./controllers/restaurant/findOne.js");
const searchRestaurants = require("./controllers/restaurant/findSearchedItems.js");
const authenticateRestaurant = require("./controllers/restaurant/authenticate.js");
const updateRestaurant = require("./controllers/restaurant/update.js");
const createRestaurantAddress = require("./controllers/restaurant_address/create.js");
const findRestaurantAddress = require("./controllers/restaurant_address/findOne.js");
const createDish = require("./controllers/dish/create.js");
const findAllDishes = require("./controllers/dish/findAll.js");
const findDishById = require("./controllers/dish/findById.js");
const updateDish = require("./controllers/dish/update.js");
const placeOrder = require("./controllers/order/placeOrder.js");
const updateOrderStatus = require("./controllers/order/updateStatus.js");
const fetchCustomerOrders = require("./controllers/order/fetchOrdersForCustomer.js");
const fetchRestaurantOrders = require("./controllers/order/fetchOrdersForRestaurant.js");
const fetchCustomerOrderPageNumbers = require("./controllers/order/fetchpageNumbersForCustomerOrders.js");
const fetchRestaurantOrderPageNumbers = require("./controllers/order/fetchpageNumbersForRestaurantOrders.js");

const db = require("./models/db.js");
db.mongoose
	.connect(db.url, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		maxPoolSize: 500,
	})
	.then(() => {
		console.log("Connected to the database!");
	})
	.catch((err) => {
		console.log("Cannot connect to the database!", err);
		process.exit();
	});

function handleTopicRequest(topic_name, fname) {
	//var topic_name = 'root_topic';
	var consumer = connection.getConsumer(topic_name);
	var producer = connection.getProducer();
	// console.log('server is running ');
	consumer.on("message", function (message) {
		console.log("message received for " + topic_name + " ", fname);
		console.log(JSON.stringify(message.value));
		var data = JSON.parse(message.value);

		fname.handle_request(data.data, function (err, res) {
			console.log("after handle" + res);
			var payloads = [
				{
					topic: data.replyTo,
					messages: JSON.stringify({
						correlationId: data.correlationId,
						data: res,
					}),
					partition: 0,
				},
			];
			producer.send(payloads, function (err, data) {
				console.log(data);
			});
			return;
		});
	});
}

// Topics
handleTopicRequest("lab3.customers.create", createCustomer);
handleTopicRequest("lab3.customers.findAll", findAllCustomers);
handleTopicRequest("lab3.customers.authenticate", authenticateCustomer);
handleTopicRequest("lab3.customers.findOne", findCustomerById);
handleTopicRequest("lab3.customers.update", updateCustomer);
handleTopicRequest("lab3.customer_addresses.create", createCustomerAddress);
handleTopicRequest("lab3.customer_addresses.delete", deleteCustomerAddress);
handleTopicRequest("lab3.customer_addresses.findAll", findAllCustomerAddresses);
handleTopicRequest("lab3.favourites.create", createFavourite);
handleTopicRequest("lab3.favourites.delete", deleteFavourite);
handleTopicRequest("lab3.favourites.findAll", findAllFavourites);
handleTopicRequest("lab3.restaurants.create", createRestaurant);
handleTopicRequest("lab3.restaurants.findAll", findAllRestaurants);
handleTopicRequest("lab3.restaurants.findOne", findRestaurantById);
handleTopicRequest("lab3.restaurants.findSearchedItems", searchRestaurants);
handleTopicRequest("lab3.restaurants.authenticate", authenticateRestaurant);
handleTopicRequest("lab3.restaurants.update", updateRestaurant);
handleTopicRequest("lab3.restaurant_addresses.create", createRestaurantAddress);
handleTopicRequest("lab3.restaurant_addresses.findOne", findRestaurantAddress);
handleTopicRequest("lab3.dishes.create", createDish);
handleTopicRequest("lab3.dishes.findAll", findAllDishes);
handleTopicRequest("lab3.dishes.findById", findDishById);
handleTopicRequest("lab3.dishes.update", updateDish);
handleTopicRequest("lab3.orders.placeOrder", placeOrder);
handleTopicRequest("lab3.orders.updateStatus", updateOrderStatus);
handleTopicRequest("lab3.orders.fetchOrdersForCustomer", fetchCustomerOrders);
handleTopicRequest(
	"lab3.orders.fetchOrdersForRestaurant",
	fetchRestaurantOrders
);
handleTopicRequest(
	"lab3.orders.fetchpageNumbersForCustomerOrders",
	fetchCustomerOrderPageNumbers
);
handleTopicRequest(
	"lab3.orders.fetchpageNumbersForRestaurantOrders",
	fetchRestaurantOrderPageNumbers
);
