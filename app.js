require('dotenv').config();

const express = require('express');
const expressLayout = require('express-ejs-layouts');

const connectDB = require('./server/config/db')

const app = express();
const PORT = 5000; //process.env.PORT; of you want to put online

//connect to DB
connectDB();

//template engine => for ejs
app.use(expressLayout);
app.set('layout', './layouts/main');
app.set('view engine', 'ejs');


 //points to public folder => don't have to exit folder to enter 
 // another folder, since all page stuff in public
app.use(express.static('public'))

app.use('/', require('./server/routes/main')); //main is the actual file

app.listen(PORT, () => {
    console.log('App listening on port 5000');
});
