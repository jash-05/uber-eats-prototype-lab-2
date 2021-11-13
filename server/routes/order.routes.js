const { checkAuth } = require("../passport/passport.js");

module.exports = app => {
    const orders = require("../controllers/order.controller.js");

    // app.get("/getOrderDetails", orders.getOrder);
    
    // app.get("/getOrderItems", orders.getOrderItemsByOrderID);

    // app.post("/addOrderItem", orders.addItem);

    // app.delete("/deleteInCartOrder/:customer_ID", orders.deleteInCartOrder);

    app.get("/fetchOrdersForCustomer", checkAuth, orders.fetchOrdersForCustomer);

    app.get("/fetchOrdersForRestaurant", orders.fetchOrdersForRestaurant);

    app.get("/fetchPageNumbersForRestaurantOrders", orders.fetchPageNumbersForRestaurantOrders);

    app.get("/fetchPageNumbersForCustomerOrders", checkAuth, orders.fetchPageNumbersForCustomerOrders);

    //Add API : page numbers for customer orders
    
    app.post('/placeOrder', checkAuth, orders.placeOrder);

    app.post('/updateOrderStatus', orders.updateStatus);
}