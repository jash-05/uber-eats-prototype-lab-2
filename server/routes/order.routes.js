module.exports = app => {
    const orders = require("../controllers/order.controller.js");

    app.get("/getOrderDetails", orders.getOrder);
    
    app.get("/getOrderItems", orders.getOrderItemsByOrderID);

    app.post("/addOrderItem", orders.addItem);

    app.delete("/deleteInCartOrder/:customer_ID", orders.deleteInCartOrder);

    app.get("/fetchOrdersForCustomer", orders.fetchOrdersForCustomer);

    app.get("/fetchOrdersForRestaurant", orders.fetchOrdersForRestaurant);
    
    app.post('/placeOrder', orders.placeOrder);

    app.post('/updateOrderStatus', orders.updateStatus);
}