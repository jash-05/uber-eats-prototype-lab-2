const express = require('express');
const bodyParser = require('body-parser');
const cors = require("cors");
// const { Session } = require('express-session');
const session = require('express-session');
const cookieParser = require('cookie-parser');
var kafka = require('./kafka/client');

const app = express();

app.set('view engine', 'ejs');
app.set('views','./views')
app.use(express.static(__dirname + '/public'));

const serverConfig = require('./config/config.js');

// app.use(cookieParser());
// app.use(session({
//     secret: 'cmpe_273_secure_string',
//     resave: false,
//     saveUninitialized: true
// }));
app.use(express.json());

app.use(cors({
    origin: [`http://${serverConfig.SERVER_IP}:3000`],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true
}));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
    // key: "userId",
    secret: "cmpe_273_secret",
    resave: false,
    saveUninitialized: false,
    duration: 60 * 60 * 1000,
    activeDuration: 5 * 60 * 1000
    // cookie: {
    //     expires: 60 * 60 * 24 * 1000
    // }
}));

//Allow Access Control
app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', `http://${serverConfig.SERVER_IP}:3000`);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');
    res.setHeader('Cache-Control', 'no-cache');
    next();
  });

//Passport
const passport = require("passport")
app.use(passport.initialize());

const db = require("./models/db.js");
db.mongoose
.connect(db.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    maxPoolSize: 500
})
.then(() => {
    console.log("Connected to the database!");
})
.catch(err => {
    console.log("Cannot connect to the database!", err);
    process.exit();
});

app.get('/', (req, res) => {
    res.json({
        message: 'Welcome to my uber eats application!'
    });
})

app.post('/login', function(req, res){
    console.log('Inside POST login route');
    console.log(req.body)
    // req.body.email_id = req.body.username;
    if (req.body.email_id === 'jash@sjsu') {
        console.log(`${req.body.email_id} === jash@sjsu`);
        res.cookie('cookie',"uber-eats-admin",{maxAge: 900000, httpOnly: false, path : '/'});
        req.session.user = req.body.email_id;
        res.writeHead(200, {
            'Content-Type': 'text/plain'
        })
        res.end("Successful login");        
    } else {
        res.writeHead(200, {
            'Content-Type': 'text/plain'
        })
        res.end("Unsuccessful login");
    }
});


app.get('/login',(req, res) => {
    if (req.session.user){
        res.send({loggedIn: true, user: req.session.user})
    } else {
        res.send({loggedIn: false})
    }
});


app.post('/register', (req, res) => {
    console.log(req.body)
    // req.session.user = req.body.email;
    // console.log(req.session.user);
    res.send('registered successfully');
})

app.post('/book', function(req, res){
    kafka.make_request('customers.create',req.body, function(err,results){
        console.log('in result');
        console.log(results);
        if (err){
            console.log("Inside err");
            res.json({
                status:"error",
                msg:"System Error, Try Again."
            })
        }else{
            console.log("Inside else");
                res.json({
                    updatedList:results
                });

                res.end();
            }
    });
});

require("./routes/tutorial.routes")(app);
require("./routes/customer.routes")(app);
require("./routes/restaurant.routes.js")(app);
require("./routes/favourite.routes.js")(app);
require("./routes/customer_address.routes.js")(app);
require("./routes/restaurant_address.routes.js")(app);
require("./routes/dish.routes.js")(app);
require("./routes/order.routes.js")(app);

app.listen(3001, () => {
    console.log('Server is running on port 3001');
});