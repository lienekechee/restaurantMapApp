const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const session = require('express-session')
const Sequelize = require('sequelize')
const bcrypt = require('bcrypt')

var Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));

const database = new Sequelize('restaurantmapappdb', process.env.POSTGRES_USER, null, {
    host: 'localhost',
    dialect: 'postgres'
});

const app = express()

app.set('views', './views')
app.set('view engine', 'pug')

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));
console.log(__dirname)

app.use(session({
    secret: "Your secret key",
    resave: true,
    saveUninitialized: false
}))

//DEFINITION OF TABLES++++++++++++++++++++++++++++++++++++++++++++++++++++++++

var User = database.define('users', {
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
}, {
    timestamps: false
});

var Review = database.define('reviews', {
    restaurantName: {
        type: Sequelize.STRING
    },
    restaurantId: {
        type: Sequelize.STRING //TRCID
    },
    body: {
        type: Sequelize.TEXT
    }
}, {
    timestamps: false

});


database.sync() //{force: true}




//RELATIONSHIPS+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

User.hasMany(Review);
Review.belongsTo(User);



//ROUTES++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

//1. GET REQUEST (INDEX & LOGIN FORM)

app.get('/', (req, res) => {

    fs.readFile('../public/restaurantDataAMS.json', (err, data) => {
        if (err) {
            throw err;
        }
        // console.log (data)
        var restaurants = JSON.parse(data)
        console.log(restaurants[0])

        res.render('index', {
            message: req.query.message,
            user: req.session.user
        })
    })
});

//2. POST REQUEST (LOGIN)

app.post('/login', (req, res) => {

    const email = req.body.email
    const password = req.body.password

    User.findOne({
            where: {
                email: email
            }
        })
        .then(user => {

            bcrypt.compare(password, user.password, function(err, result) {
                if (err !== undefined) {
                    console.log(err);
                    res.redirect('/?message=' + encodeURIComponent("Invalid email or password."));
                } else {
                    req.session.user = user;
                    res.redirect('/profile');
                }
            })
        })
        .catch(error => {
            console.error(error)
            res.redirect('/?message=' + encodeURIComponent("Invalid email or password."));
        })

})

//3. GET REQUEST (GET PROFILE)

app.get('/profile', (req, res) => {

    const user = req.session.user

    fs.readFile('../public/restaurantDataAMS.json', (err, data) => {
        if (err) {
            throw err;
        }

        var restaurants = JSON.parse(data)

        if (user) {
            Review.findAll({
                    where: {
                        userId: req.session.user.id
                    },
                    order: [
                        ['id', 'DESC']
                    ],
                })
                .then(reviews => {
                    res.render('profile', {
                        user: user,
                        reviews: reviews
                    })
                })
        } else {
            res.redirect('/?message=' + encodeURIComponent("Please log in!"));
        }
    })
});

//. GET REQUEST (REGISTER FORM)

app.get('/registerform', (req, res) => {
    res.render('register')
})

//. POST REQUEST (CREATE PROFILE INCLUDING SEARCH FUNCTION, OWN REVIEWS, PERSONAL INFO, LOCATION?)

app.post('/register', (req, res) => {

    const password = req.body.passwordNew

    bcrypt.hash(password, 8, function(err, hash) {
        if (err !== undefined) {
            console.log(err)
        } else {
            User.create({
                    username: req.body.usernameNew,
                    email: req.body.emailNew,
                    password: hash
                })
                .then(function() {
                    res.redirect('/')
                }).catch(err => {
                    console.error(err)
                })
        }
    })


})

//. GET REQUEST (NAVIGATE TO FEED)

app.get('/feed', (req, res) => {

    fs.readFile('../public/restaurantDataAMS.json', (err, data) => {
        if (err) {
            throw err;
        }

        var restaurants = JSON.parse(data)

        res.render('feed', { restaurants: restaurants })
    })
})


//. POST REQUEST (SEARCH JSON FOR RESTAURANTS)
// here we get the restaurant data from the ajax request.
// then we iterate through the data set to find a match between data[i].title
// and req.body.search

app.post('/findrestaurants', (req, res) => {

    const user = req.session.user
    const search = req.body.searchrestaurants
    console.log(search)

    fs.readFile('../public/restaurantDataAMS.json', "utf8", (err, data) => {
        if (err) {
            throw err;
        }

        var restaurants = JSON.parse(data)
        // console.log(restaurants)

        for (i = 0; i < restaurants.length; i++) {

            if (search.toLowerCase() === restaurants[i].title.toLowerCase()) {
                console.log(restaurants[i].title)

                res.render('feed', { restaurant: restaurant[i].title })
                //pass on result of specific restaurant to feed page.
            }

        }
    })



})

//  GET REQUEST (GET RESTAURANT DATA)

app.get('/getrestaurants', (req, res) => {

    fs.readFile("../public/restaurantDataAMS.json", (err, data) => {
        if (err) {
            throw err
        }

        var restaurants = JSON.parse(data)

        var searchrestaurants = req.query.searchrestaurants;
        console.log(searchrestaurants);

        var matchingRestaurants = []

        if (req.query.searchrestaurants == "") {
            matchingRestaurants == []
        }


        //.toLowerCase employed for both input and parsedData keys to creat case-insensitivity.
        else {
            for (var i = 0; i < restaurants.length; i++) {
                if (restaurants[i].title.toLowerCase().indexOf(searchrestaurants.toLowerCase()) !== -1 || restaurants[i].details.en.shortdescription.toLowerCase().indexOf(searchrestaurants.toLowerCase()) !== -1) {
                    matchingRestaurants.push(restaurants[i])

                }

                // console.log(matchingRestaurants)
            }
        }

        res.send({ matchingRestaurants: matchingRestaurants })

    });
})

//. POST REQUEST - POST INFO FROM LINK CLICKED POINTING TO SPECIFIC RESTAURANT; PASS ON RESULT
//  get properties of data[i] from '/getRestaurant' post request.
//  redirect to '/restaurant/:restaurantId' and pass on info

app.post('/restaurantViaLink', (req, res) => {

    const trcid = req.body.restaurantLink
    console.log(trcid)
    const user = req.session.user

    fs.readFileAsync("../public/restaurantDataAMS.json", (err, data) => {
        if (err) {
            throw err
        }

        var restaurants = JSON.parse(data)


        for (i = 0; i < restaurants.length; i++) {
            if (trcid === restaurants[i].trcid) {
                console.log(restaurants[i])
            }
        }


    }).then(restaurant => {
        console.log(restaurant)
        res.redirect(`/restaurant/${restaurant.trcid}`)
    })


})


//. GET REQUEST (GET RESTAURANT PROFILE INCLUDING MAP, INFO/MEDIA, RATING, REVIEWS, & CREATE REVIEW)
// two main things need to happen here: 
//a) read and send data from the json ; 
//b) query the database to find the review for that restaurant
// the database is queried with the TRCID value passed on by the restaurant link clicked by the user

app.get('/restaurant/:trcid', (req, res) => {

    const user = req.session.user
    const trcid = req.params.trcid
    console.log(trcid)

    Review.findAll({
        where: {
            restaurantId: trcid
        }
    }).then(reviews => {

    console.log("###all the reviews!" + reviews) 

    fs.readFileAsync("../public/restaurantDataAMS.json")

            .then(data => {

        console.log('Parsed data ' + JSON.parse(data))
        return JSON.parse(data);
            })
            .then(restaurants => {

                for (i = 0; i < restaurants.length; i++) {
                    if (restaurants[i].trcid == trcid) {
                        console.log(restaurants[i])
                        return restaurants[i];
                    }
                }
            })
            .then(restaurant => {
                res.render('restaurant', {
                    restaurant: restaurant,
                    reviews: reviews
                })
            }).catch(err => {
                console.error(err)
            });
        })
})

// fs.readFileAsync(, (data) => {

//     var restaurants = JSON.parse(data)

//     for (i = 0; i < restaurants.length; i++) {
//         if (restaurants[i].trcid == trcid) {
//             console.log(restaurants[i].trcid)
//             console.log(restaurants[i])

//                 }}
//             })
//         .then(restaurant =>{

//             console.log(restaurant)
//             Review.findAll({
//                 where: {
//                     restaurantId: trcid
//                 }
//             })

//             .then(reviews => {
//                 console.log(restaurant)
//                 console.log(reviews)
//                 res.render('restaurant', {
//                     restaurant: restaurant,
//                     reviews: reviews
//                 });
//             })
//         })
//     });







//. POST REQUEST (CREATE A REVIEW)

app.post('/writeReview', (req, res) => {
    const user = req.session.user
    const trcid = req.body.restaurantId


    User.findOne({
        where: {
            id: user.id
        }
    }).then(user => {
        return user.createReview({
            restaurantName: req.body.restaurantName,
            restaurantId: req.body.restaurantId,
            body: req.body.reviewBody
        })
    })
})


//. GET REQUEST (LOG OUT)

app.get('/logout', (req, res) => {
    req.session.destroy(error => {
        if (error) {
            throw error;
        }
        res.redirect('/?message=' + encodeURIComponent("Successfully logged out."));
    })
});

app.listen(3000, function() {
    console.log("Listening on port 3000")
})