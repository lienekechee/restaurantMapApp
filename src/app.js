const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const session = require('express-session')
const Sequelize = require('sequelize')
const fs = require ('fs')

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

var User = database.define ('users', {
	username: {
		type: Sequelize.STRING,
		unique: true,

	},
	email: {
		type: Sequelize.STRING,
		unique: true
	},
	password: {
		type: Sequelize.STRING,
	}
},{
	timestamps:false
});

var Restaurant = database.define('restaurants', {
	name: {
		type: Sequelize.STRING
	},
	address: {
		type: Sequelize.STRING
	},
	latitude: {
		type: Sequelize.STRING
	},
	longitude: {
		type: Sequelize.STRING
	},
	media: {
		type: Sequelize.STRING
	},
	description: {
		type: Sequelize.STRING
	},
	website: {
		type: Sequelize.STRING
	}
})

var Review = database.define('posts', {
	subject: {
		type: Sequelize.STRING
	},
	body: {
		type: Sequelize.TEXT
	}
	},{
	timestamps:false

}); 

var Rating = database.define('comments', {
	content: {
		type: Sequelize.TEXT
	}
},{
	timestamps:false

});


//CREATING RESTAURANT TABLE FROM JSON = = ==  = 



//RELATIONSHIPS+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

//ROUTES++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

//1. GET REQUEST (INDEX & LOGIN FORM)

app.get('/', function (req, res){
	res.render ('index', {
		message: req.query.message,
		user: req.session.user
	})
});

//2. POST REQUEST (LOGIN)

app.post('/login',(req, res) => {

	var email = req.body.email
	var password = req.body.password

	User.findOne({
		where: {
			email: email
		}
	})
	.then(user => {
		if (user !== null && password === user.password) {
			req.session.user = user;
			res.redirect('/profile');
		} else {
			res.redirect('/?message=' + encodeURIComponent("Invalid email or password."));
		}
	})
	.catch(error => {
		console.error(error)
		res.redirect('/?message=' + encodeURIComponent("Invalid email or password."));
	})

})

//3. GET REQUEST (GET PROFILE)


//. GET REQUEST (REGISTER FORM)

app.get('/registerform', (req, res) => {
	res.render ('register')
})

//. POST REQUEST (CREATE PROFILE INCLUDING SEARCH FUNCTION, OWN REVIEWS, PERSONAL INFO, LOCATION?)

app.post('/register', (req, res) => {
	
	User.create({
		username: req.body.usernameNew,
		email: req.body.emailNew,
		password: req.body.passwordNew
	})
	.then(function(){
		res.redirect('/')
	})
})

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







