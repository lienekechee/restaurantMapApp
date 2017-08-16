const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const session = require('express-session')
const Sequelize = require('sequelize')

const database = new Sequelize('restaurantMapAppDB', process.env.POSTGRES_USER, null, {
	host: 'localhost',
	dialect: 'postgres'
});

const app = express()

app.set('views', './views')
app.set('view engine', 'pug')

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));
	console.log (__dirname)

app.use(session({
  secret: "Your secret key",
  resave: true,
saveUninitialized: false
}))

//DEFINITION OF TABLES++++++++++++++++++++++++++++++++++++++++++++++++++++++++

//RELATIONSHIPS+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

//ROUTES++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

//1. GET REQUEST (INDEX & LOGIN FORM)

//2. POST REQUEST (LOGIN)

//3. GET REQUEST (GET PROFILE)

//. GET REQUEST (REGISTER FORM)

//. POST REQUEST (CREATE PROFILE INCLUDING SEARCH FUNCTION, OWN REVIEWS, PERSONAL INFO, LOCATION?)

//. POST REQUEST (SEARCH JSON FOR RESTAURANTS)

//. GET REQUEST (GET RESTAURANT PROFILE INCLUDING MAP, INFO/MEDIA, RATING, REVIEWS, & CREATE REVIEW)

//. GET REQUEST (GET MAP FOR RESTAURANT WITH LOCATION MARKED)

//. GET REQUEST (GET DIRECTIONS)

//. POST REQUEST (CREATE A REVIEW)

//. POST REQUEST (GIVE A RATING)

//. GET REQUEST (LOG OUT)

app.listen(3000, function(){
	console.log("Listening on port 3000")
})










