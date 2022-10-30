const express = require('express');
const cors = require('cors');
const session = require('express-session');

const connectDB = require('./config/database');

const app = express();
app.use(cors());

// Connect Database
connectDB();

const PORT = process.env.PORT || 8000;

//Express Session Middleware
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
}));

// Init Middleware
app.use(express.json({extended: false}));

// Defining Routes for User Auth
app.use('/users', require('./routes/users'));

app.listen(PORT, () => {
    console.log(`server running on PORT ${PORT}`);
});