import express from 'express';
import bookRouter from './Routes/bookRouter';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';


var mongooseOptions = {
    useNewUrlParser: true,
    user: 'mo1189_nokia',
    pass: process.env.MO1189_NOKIA_PWD,
    promiseLibrary: global.Promise
}
// mongoose instance connection url connection
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://mongo7.mydevil.net/mo1189_nokia', mongooseOptions);
const db = mongoose.connection;


const app = express();
const port = process.env.PORT || 5656;
// post body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// routes go here
app.use('/api/Books', bookRouter);
app.listen(port, () => {
    console.log(`http://localhost:${port}`)
});
