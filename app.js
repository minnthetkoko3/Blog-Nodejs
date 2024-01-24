require('dotenv').config();
const express = require("express");
const expressLayout = require("express-ejs-layouts");
const connectDB = require('./server/config/db');
const cookieParser = require('cookie-parser');
const MongoStore = require("connect-mongo");
const session = require('express-session');
const methodOverrride = require('method-override');
const {isActiveRoute} = require('./server/helpers/routerHelper');

const app = express();
const PORT = 5555|| process.env.PORT;

app.use(express.static('public'))

//connect db
connectDB();

app.use(express.urlencoded({ extended: true}));
app.use(express.json());
app.use(cookieParser());
app.use(methodOverrride("_method"));

app.use(session({
   secret: "keyboard cat",
   resave: false,
   saveUninitialized: true,
   store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI
     }),
//     // cookie: {maxAge: new Date (Date.now() + (3600000) ) }
}));

// Templating Engine
app.use(expressLayout);
app.set('layout', './layouts/main');
app.set('view engine', 'ejs');

app.locals.isActiveRoute = isActiveRoute;

app.use("/", require("./server/routes/main"));
app.use("/", require("./server/routes/admin"));

app.listen(PORT, () => {
    console.log(`listening port at ${PORT}`);
});
