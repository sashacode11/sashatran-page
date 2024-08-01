require('dotenv').config();

const express = require('express');
const expressLayout = require('express-ejs-layouts');

const connectDB = require('./server/config/db');
const MongoStore = require('connect-mongo');
const methodOverride = require('method-override');
const session = require('express-session');
const cookieParser = require('cookie-parser');

const app = express();
const PORT = 5000;

// Connect DB
connectDB();

// Serve static file
app.use(express.static('public'));

// search
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(methodOverride('_method'));

app.use(
  session({
    secret: 'node keyboard cat and dog',
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
    }),
  })
);
// app.use(flash());

// Templating engine
app.use(expressLayout);
app.set('layout', './layouts/main');
app.set('view engine', 'ejs');

app.use('/', require('./server/routes/main'));
app.use('/', require('./server/routes/admin'));

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
