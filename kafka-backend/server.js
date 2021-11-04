var connection =  new require('./kafka/Connection');

const createCustomer = require('./controllers/customer/create.js');
const findAllCustomers = require('./controllers/customer/findAll.js');
const authenticateCustomer = require('./controllers/customer/authenticate.js');
const findCustomerById = require('./controllers/customer/findOne.js');
const updateCustomer = require('./controllers/customer/update.js');
// const createCustomerAddress = require('./controllers/customer_address/create.js');
// const deleteCustomerAddress = require('./controllers/customer_address/delete.js');
// const findAllCustomerAddresses = require('./controllers/customer_address/findAll.js');
// const createFavourite = require('./controllers/favourite/create.js');
// const deleteFavourite = require('./controllers/favourite/delete.js');
// const findAllFavourites = require('./controllers/favourite/findAll.js');
// const createRestaurant = require('./controllers/restaurant/create.js');
// const findAllRestaurants = require('./controllers/restaurant/findAll.js');
// const findRestaurantById = require('./controllers/restaurant/findOne.js');
// const searchRestaurants = require('./controllers/restaurant/findSearchedItems.js');
// const authenticateRestaurant = require('./controllers/restaurant/authenticate.js');
// const createRestaurantAddress = require('./controllers/restaurant_address/create.js');
// const findRestaurantAddress = require('./controllers/restaurant_address/findOne.js');
// const placeOrder = require('./controllers/order/placeOrder.js');
// const updateOrderStatus = require('./controllers/order/updateStatus.js');
// const fetchCustomerOrders = require('./controllers/order/fetchOrdersForCustomer.js');
// const fetchRestaurantOrders = require('./controllers/order/fetchOrdersForRestaurant.js');
// const fetchCustomerOrderPageNumbers = require('./controllers/order/fetchpageNumbersForCustomerOrders.js');
// const fetchRestaurantOrderPageNumbers = require('./controllers/order/fetchpageNumbersForRestaurantOrders.js');

const db = require("./models/db.js");
db.mongoose
.connect(db.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log("Connected to the database!");
})
.catch(err => {
    console.log("Cannot connect to the database!", err);
    process.exit();
});

function handleTopicRequest(topic_name,fname){
    //var topic_name = 'root_topic';
    var consumer = connection.getConsumer(topic_name);
    var producer = connection.getProducer();
    // console.log('server is running ');
    consumer.on('message', function (message) {
        console.log('message received for ' + topic_name +" ", fname);
        console.log(JSON.stringify(message.value));
        var data = JSON.parse(message.value);
        
        fname.handle_request(data.data, function(err,res){
            console.log('after handle'+res);
            var payloads = [
                { topic: data.replyTo,
                    messages:JSON.stringify({
                        correlationId:data.correlationId,
                        data : res
                    }),
                    partition : 0
                }
            ];
            producer.send(payloads, function(err, data){
                console.log(data);
            });
            return;
        });
        
    });
}

// Topics
handleTopicRequest("customers.create", createCustomer);
handleTopicRequest("customers.findAll", findAllCustomers);
handleTopicRequest("customers.authenticate", authenticateCustomer);
handleTopicRequest("customers.findOne", findCustomerById);
handleTopicRequest("customers.update", updateCustomer);
// handleTopicRequest("customer_addresses.create", createCustomerAddress);
// handleTopicRequest("customer_addresses.delete", deleteCustomerAddress);
// handleTopicRequest("customer_addresses.findAll", findAllCustomerAddresses);
// handleTopicRequest("favourites.create", createFavourite);
// handleTopicRequest("favourites.delete", deleteFavourite);
// handleTopicRequest("favourites.findAll", findAllFavourites);
// handleTopicRequest("restaurants.create", createRestaurant);
// handleTopicRequest("restaurants.findAll", findAllRestaurants);
// handleTopicRequest("restaurants.findOne", findRestaurantById);
// handleTopicRequest("restaurants.findSearchedItems", searchRestaurants);
// handleTopicRequest("restaurants.authenticate", authenticateRestaurant);
// handleTopicRequest("restaurant_addresses.create", createRestaurantAddress);
// handleTopicRequest("restaurant_addresses.findOne", findRestaurantAddress);
// handleTopicRequest("orders.placeOrder", placeOrder);
// handleTopicRequest("orders.updateStatus", updateOrderStatus);
// handleTopicRequest("orders.fetchOrdersForCustomer", fetchCustomerOrders);
// handleTopicRequest("orders.fetchOrdersForRestaurant", fetchRestaurantOrders);
// handleTopicRequest("orders.fetchpageNumbersForCustomerOrders", fetchCustomerOrderPageNumbers);
// handleTopicRequest("orders.fetchpageNumbersForRestaurantOrders", fetchRestaurantOrderPageNumbers);