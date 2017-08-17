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

//GET:
data[i].title //name of restaurant
data[i].location.adress
data[i].location.city
data[i].location.zipcode
data[i].location.latitude
data[i].location.longitude
data[i].media[0].url //url to main photo
data[i].details.en.shortdescription //description of restaurant
data[i].urls[0] //main URL






