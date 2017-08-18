const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const session = require('express-session')
const Sequelize = require('sequelize')
const fs = require ('fs')

const database = new Sequelize('restaurantmapappdb', process.env.POSTGRES_USER, null, {
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

// var Restaurant = database.define('restaurants', {
// 	name: {
// 		type: Sequelize.STRING
// 	},
// 	address: {
// 		type: Sequelize.STRING
// 	},
// 	latitude: {
// 		type: Sequelize.STRING
// 	},
// 	longitude: {
// 		type: Sequelize.STRING
// 	},
// 	media: {
// 		type: Sequelize.STRING
// 	},
// 	description: {
// 		type: Sequelize.STRING
// 	},
// 	website: {
// 		type: Sequelize.STRING
// 	}
// })

var Review = database.define('posts', {
	restaurantName: {
		type: Sequelize.STRING
	},
	restaurantId: {
		type: Sequelize.STRING //TRCID
	},
	body: {
		type: Sequelize.TEXT
	}
	},{
	timestamps:false

}); 

var Rating = database.define('comments', {
	restaurantName: {
		type: Sequelize.STRING
	},
	restaurantId: {
		type: Sequelize.STRING //TRCID
	},
	rating: {
		type: Sequelize.STRING //?
	}
},{
	timestamps:false

});


database.sync() //{force: true}

//RELATIONSHIPS+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

User.hasMany(Review);
Review.belongsTo(User);



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

app.get('/profile', (req, res) => {
    
    var user = req.session.user

	if (user) {
		Review.findAll({
			where: {
			    userId: req.session.user.id
			},
			order:[
				['id', 'DESC']
			],
		})
		.then(reviews => {
			res.render('profile', {
				user:user, 
				reveiws: reviews
			})
		})
	} else{
		res.redirect('/?message='+ encodeURIComponent("Please log in!"));
	}
	
});

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

//. GET REQUEST (NAVIGATE TO FEED)

app.get('/feed', (req, res)=>{
	res.render ('feed')
})

//. POST REQUEST (SEARCH JSON FOR RESTAURANTS)
// here we get the restaurant data from the ajax request.
// then we iterate through the data set to find a match between data[i].title
// and req.body.search

app.post('/getrestaurants', (req, res)=>{
	const search = req.body.searchRestaurants
		console.log(search)
	const data = req.query.data 
		console.log(data)
	const user = req.session.user


	const matchingRestaurants = []

	for(i=0; i < data.length; i++){
		if (search.toLowerCase() === data[i].title.toLowerCase()){
			console.log(data[i])

			res.render('feed', {restaurant: data[i]}) //pass on result of specific restaurant to feed page.
		}

		
	}


	
})

//. POST REQUEST - POST INFO FROM LINK CLICKED POINTING TO SPECIFIC RESTAURANT; PASS ON RESULT
//  get properties of data[i] from '/getRestaurant' post request.
//  redirect to '/restaurant/:restaurantId' and pass on info

app.post('/getRestaurantFromLink', (req, res)=>{
	const user = req.session.user
	const data = req.query.data

	Review.findAll({
		where: {
			restaurantName: restaurant.title
		}
	}).then(reviews => {
		res.redirect (`/restaurant/${restaurant.id}`)
	})
	


})

//. GET REQUEST (GET RESTAURANT PROFILE INCLUDING MAP, INFO/MEDIA, RATING, REVIEWS, & CREATE REVIEW)


app.get('/restaurant/:restaurantId', (req, res) => {
	const data = req.query.data
	const restaurantId = data.trcid

	//

})



//. GET REQUEST (GET MAP FOR RESTAURANT WITH LOCATION MARKED)

//. GET REQUEST (GET DIRECTIONS)

//. POST REQUEST (CREATE A REVIEW)



//. POST REQUEST (GIVE A RATING)

//. GET REQUEST (LOG OUT)

app.get('/logout', (req, res) => {
	req.session.destroy(error => {
		if(error) {
			throw error;
		}
		res.redirect('/?message=' + encodeURIComponent("Successfully logged out."));
	})
});

app.listen(3000, function(){
	console.log("Listening on port 3000")
})







