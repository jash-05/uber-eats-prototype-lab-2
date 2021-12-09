const express = require('express');
const bodyParser = require('body-parser')
const app = express();
const expressGraphQL = require('express-graphql')
const { graphqlHTTP } = require('express-graphql')
const {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLString
} = require('graphql')

const schema = require('./graphql/schema')

// const schema = new GraphQLSchema({
//     query: new GraphQLObjectType({
//         name: "HelloWorld",
//         fields: () => ({

//             message: {
//                 type: GraphQLString,
//                 resolve: () => 'Hello World'
//             }

//         })
//     })
// })


const cors = require('cors');

const session = require('express-session');
const fileUpload = require('express-fileupload')
const path = require('path');
//use cors to allow cross origin resource sharing
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));


app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors())
app.use(fileUpload())



//use express session to maintain session data
app.use(session({
    secret: 'cmpe_273_lab1',
    resave: false, // Forces the session to be saved back to the session store, even if the session was never modified during the request
    saveUninitialized: false, // Force to save uninitialized session to db. A session is uninitialized when it is new but not modified.
    duration: 2 * 60 * 60 * 1000,
    activeDuration: 10 * 60 * 1000
}));

//Allow Access Control
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');
    res.setHeader('Cache-Control', 'no-cache');
    next();
});

// const { mongoDB } = require('./config');
const mongoose = require('mongoose');
// console.log("MDB", mongoDB)
const db = require("./models/db.js");
const { resolve } = require('path');


let options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    poolSize: 500,
    bufferMaxEntries: 0
};

db.mongoose.connect(db.url, options)
    .then(() => {
        console.log('MongoDB Connected');
    })
    .catch(err => {
        console.log("Error connecting to mongo")
        process.exit();
    })




app.get('/', (req, res) => {
    res.json({ message: "Welcome Aaron to your test GET Request" })
})


app.use('/graphql', graphqlHTTP({
    schema: schema,
    graphiql: true
}))
require("./routes/login-route.js")(app);
require("./routes/Mongo/customer-M-routes")(app);
require("./routes/Mongo/restaurant-M-routes")(app);
require("./routes/Mongo/order-M-routes")(app);
// require("./routes/customer-routes.js")(app);
// require("./routes/restaurant-routes.js")(app);
// require("./routes/credential-routes.js")(app);
// require("./routes/custAddress-routes.js")(app);
// require("./routes/orders-routes.js")(app);
// require("./routes/customRoutes/custIdFromCred-route.js")(app);
// require("./routes/customRoutes/dishesbyRest-route.js")(app);
// require("./routes/customRoutes/getRestId-DishName.js")(app);
// require("./routes/customRoutes/getRestId-Type.js")(app);
// require("./routes/favourites-routes.js")(app);
// require("./routes/ordersByRestId-route.js")(app);
// require("./routes/ordersByCustId.js")(app);
// require("./routes/dish-routes.js")(app);
// require("./routes/addOrderItems.js")(app);

// require("./routes/getRestandDishes.js")(app);

app.listen(5000, () => {
    console.log("Server started on PORT: 5000")
})


