// const fs = require ('fs')

// fs.readFile('../public/restaurantDataAMS.json', (err, data)=>{
// 	if (err){
// 		console.log (err)
// 	}
// 	var restaurantData = JSON.parse(data)
// 	// console.log ('Data parsed! '+ restaurantData)

// 	var extractedData = []
// 	for (i = 0; i < restaurantData.length; i++){
// 		console.log ('Data parsed! ' + restaurantData[i].title + restaurantData[i].location.adress)

// 		extractedData += restaurantData[i].name 
// 			fs.writeFile('restaurantDataParsed.js', restaurantData, (err) => {
// 		  		if (err) 
// 		  				throw err;
// 		  console.log('Data written!');
// 		});
// 	}

	
// })

$.getJSON('https://open.data.amsterdam.nl/EtenDrinken.json', (data)=>{
	console.log(data)
})



// var fs = require('fs')

// var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;


// var restaurantDataJSON = 'https://open.data.amsterdam.nl/EtenDrinken.json'

// var request = new XMLHttpRequest();

// request.open('GET', restaurantDataJSON);

// request.responseType = 'json';
// request.send();

// request.onload = function() {
//   var restaurantsJSON = request.response;
// // var parsedData = JSON.parse(restaurantsJSON)
//   // var restaurants = JSON.parse(restaurantsJSON)
//   	console.log (typeof restaurantsJSON)
//   }

//   // for(i = 0; i < restaurants.length; i++){
//   // 	console.log (restaurants)
//   // }


