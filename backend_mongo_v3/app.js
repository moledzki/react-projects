// Setup server port
var port = process.env.PORT || 8080;

// Import express
let express = require('express')
// Import routes
let apiRoutes = require("./api-routes")
// Import Body parser
let bodyParser = require('body-parser');
// Import Mongoose
let mongoose = require('mongoose');

// Initialize the app
let app = express();

var mongooseOptions = {
    useNewUrlParser: true,
    user: 'mo1189_nokia',
    pass: 'eI41jS9ekdhGqqIKSLlw',
    promiseLibrary: global.Promise
}
// mongoose instance connection url connection
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://mongo7.mydevil.net/mo1189_nokia', mongooseOptions);
var db = mongoose.connection;

// Configure bodyparser to handle post requests
// it has to be before app.get or app.use(/api)
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

// Send message for default URL
app.get('/', (req, res) => res.send('Hello World with Express'));
// Use Api routes in the App
app.use('/api', apiRoutes);


// Launch app to listen to specified port
app.listen(port, function () {
     console.log("Running RestHub on port " + port);
});
