require('dotenv').config();

const express = require('express');
const expressLayout = require('express-ejs-layouts');
const methodOverride = require('method-override')
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo')

const connectDB = require('./server/config/db')
const {isActiveRoute} = require('./server/helpers/routehelpers')//gotta create the css for this to work.
//require returns an object => {} gets isActiveRoute function and stores in variable isActiveRoute.
//without {}, can do isActiveRoute.isActiveRoute to call it and isActiveRoute.anyOtherFunction , since without {} is an object.

const app = express();
const PORT = 5000; //process.env.PORT; of you want to put online

//connect to DB
connectDB();

app.use(express.urlencoded({ extended: true})) //to be able to parse data from forms mainly with method="POST"
app.use(express.json()) //to be able to parse json data
app.use(cookieParser())//middleware
app.use(methodOverride('_method'))//allows you to use http verbs like put and delete even if browser doesn't support it

//template engine => for ejs
app.use(expressLayout);
app.set('layout', './layouts/main');
app.set('view engine', 'ejs');

app.locals.isActiveRoute = isActiveRoute;

app.use(session({
    secret: 'keyboard cal',
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI
    }),
    //cookie: {message: new Date (Date.now() * (3600000))}// sets exp date?

}))


 //points to public folder => don't have to exit folder to enter 
 // another folder, since all page stuff in public
app.use(express.static('public')) //=> files the server uses!!!

app.use('/', require('./server/routes/main')); //main is the actual file
app.use('/', require('./server/routes/admin')); 

app.listen(PORT, () => {
    console.log('App listening on port 5000');
});
