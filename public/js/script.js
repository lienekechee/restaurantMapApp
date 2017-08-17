


/* ----- Loading the map ------------------------------------------------------------ */

mapboxgl.accessToken = 'pk.eyJ1IjoiZmN3YnIiLCJhIjoienNUYVlNZyJ9.983XCange6sobeBpnPO4Wg';
var map = new mapboxgl.Map({
    container: 'map', 							// container id
    style: 'mapbox://styles/mapbox/light-v9', 	// stylesheet location
    center: [4.8952, 52.3702], 					// starting position [lng, lat]
    zoom: 12									// starting zoom
});


/* ----- Nav Bar - Responsive ------------------------------------------------------- */

function myFunction() {
    var x = document.getElementById("myTopnav");
    if (x.className === "topnav") {
        x.className += " responsive";
    } else {
        x.className = "topnav";
    }
}