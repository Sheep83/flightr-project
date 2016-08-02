/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var SavedSearch = __webpack_require__(1);
	var Map = __webpack_require__(2);
	var Place = __webpack_require__(3);
	
	//not added iains stuff to state
	var state = {
	  'flightsSelect': [],
	  "selectedFlight": [],
	  // "selectedFlight":[],
	  "hotelsSelect": [],
	  "selectedHotel": [],
	  "savedSearch": [],
	  "latLng": [],
	  "resultsArray": []
	}
	
	window.onload = function(){
	
	  var place = new Place();
	
	  var button = document.getElementById('button');
	  var packageButton = document.getElementById('package-button');
	  button.onclick = function(){
	    clearPreviousSearch();
	    origin = document.getElementById('origin').value;
	    destination = document.getElementById('destination').value;
	    startDate = document.getElementById('start-date').value;
	    endDate = document.getElementById('end-date').value;
	    noRooms = document.getElementById('no-rooms');
	    noRoomsValue = noRooms.options[noRooms.selectedIndex].text;
	    sendOriginRequest();
	
	    // var center = {lat: 55.9533, lng: -3.1883};
	    // var map = new Map(center);
	    // console.log(map);
	    place.populate(destination);
	  }
	
	  packageButton.onclick = function(){
	    if (state.selectedFlight.length === 0 || state.selectedHotel.length === 0) {
	      alert("You haven't selected a valid flight and hotel. Please try again.");
	    } else {
	      displaySavedSearch();
	      // NEED TO SAVE TO DB
	    }
	  }
	
	  // var center = {lat: 55.9533, lng: -3.1883};
	  // var map = new Map(center);
	};
	
	var clearPreviousSearch = function() {
	  state.flightsSelect = [];
	  state.selectedFlight = [];
	  state.hotelsSelect = [];
	  state.selectedHotel = [];
	  state.savedSearch = [];
	  state.latLng = [];
	  state.resultsArray = [];
	  clearFlightDivs();
	  clearHotelDivs();
	}
	
	var clearFlightDivs = function() {
	  var numberOfFlights = 5;
	  var localResultsArray = [];
	
	  for (var i = 0; i < numberOfFlights; i++) {
	      localResultsArray[i] = document.getElementById('flight-result' + (i)).innerHTML = "";
	    }
	  }
	
	  var clearHotelDivs = function() {
	    var numberOfHotels = 10;
	    var localResultsArray = [];
	
	    for (var i = 0; i < numberOfHotels; i++) {
	        localResultsArray[i] = document.getElementById('hotel-result' + (i)).innerHTML = "";
	      }
	    }
	
	var sendOriginRequest = function() {
	  var url_origin = "http://partners.api.skyscanner.net/apiservices/autosuggest/v1.0/GB/GBP/en-GB?query=" + origin + "&apiKey=co666659065635714271429118382522";
	
	  var req_origin = new XMLHttpRequest();
	  req_origin.open("GET", url_origin);
	  req_origin.send(null);
	
	  req_origin.onload = function() {
	    var res_origin = JSON.parse(req_origin.responseText);
	    ss_origin = res_origin.Places[0].CityId.substring(0, 3);
	    sendDestinationRequest();
	  }
	}
	
	var sendDestinationRequest = function() {
	  var url_destination = "http://partners.api.skyscanner.net/apiservices/autosuggest/v1.0/GB/GBP/en-GB?query=" + destination + "&apiKey=co666659065635714271429118382522";
	
	  var req_destination = new XMLHttpRequest();
	  req_destination.open("GET", url_destination);
	  req_destination.send(null);
	
	  req_destination.onload = function(){
	    var res_destination = JSON.parse(req_destination.responseText);
	    ss_destination = res_destination.Places[0].CityId.substring(0, 3)
	    // console.log(ss_destination);
	    sendSearchRequests();
	  }
	}
	
	var sendSearchRequests = function() {
	  var url_ss = "http://partners.api.skyscanner.net/apiservices/browsedates/v1.0/GB/GBP/en-GB/" + ss_origin + "/" + ss_destination + "/" + startDate + "/" + endDate + "?apiKey=co666659065635714271429118382522";
	
	  var url_exp = "http://terminal2.expedia.com/x/mhotels/search?city=" + destination + "&checkInDate=" + startDate + "&checkOutDate=" + endDate + "&room1=" + noRoomsValue + "&resultsPerPage=-1&apikey=fZPSPARW8ZW6Yg738AzbASiN8VPFwVos";
	
	  var req_ss = new XMLHttpRequest();
	  req_ss.open("GET", url_ss);
	  req_ss.send(null);
	  req_ss.onload = function(){
	    res_ss = JSON.parse(req_ss.responseText);
	    console.log(res_ss);
	  }
	
	  var req_exp = new XMLHttpRequest();
	  req_exp.open("GET", url_exp);
	  req_exp.send(null);
	  req_exp.onload = function(){
	    res_exp = JSON.parse(req_exp.responseText);
	
	    // NEW STUFF
	    loadCharts();
	    // NEW STUFF
	    
	    console.log(res_exp);
	    displayFlightResults();
	    displayHotelResults();
	  }
	}
	
	
	
	
	
	
	var displayFlightResults = function() {
	  var displayFlightsArray = createDisplayHandles(5, "flight");
	  var index = 0;
	
	  for (var i = 0; i < displayFlightsArray.length; i++) {
	    if (res_ss.Quotes[i]) { // if there is a valid quote then print it
	      // but only if the trip has an inbound and outbound journey
	      if (res_ss.Quotes[i].InboundLeg && res_ss.Quotes[i].OutboundLeg) {
	
	        var airlineID = res_ss.Quotes[i].InboundLeg.CarrierIds[0];
	        var airlineName = getAirlineName(airlineID);
	
	        var flightResultDetails = {"price": res_ss.Quotes[i].MinPrice, "direct": res_ss.Quotes[i].Direct, "outboundDate": res_ss.Dates.OutboundDates[0].PartialDate, "inboundDate": res_ss.Dates.InboundDates[0].PartialDate, "airline": airlineName}
	        addFlightResultToPage(flightResultDetails, displayFlightsArray, index);
	        // console.log("The index here is", index, ".....");
	        state.flightsSelect.push(flightResultDetails);
	        // console.log("flight select here:", state.flightsSelect);
	        index += 1;
	      } else {
	        continue;
	      }
	    }
	  }
	}
	
	// gets a handle on the divs used to display the flight and hotel results
	var createDisplayHandles = function(size, type) {
	  // these are global so not overwritten on each click
	  userSelectedFlights = [];
	  userSelectedHotels = [];
	
	  for (var i = 0; i < size; i++) {
	    if (type === "flight") {
	      state.resultsArray[i] = document.getElementById('flight-result' + (i));
	      state.resultsArray[i].onclick=function(e){ selectedItem(e) };
	      // NEED TO STOP THIS REGISTERING CLICK WHEN CHILD ELEMENTS ARE CLICKED
	    } else {
	      state.resultsArray[i] = document.getElementById('hotel-result' + (i));
	      state.resultsArray[i].onclick=function(e){ selectedItem(e) };
	    }
	  }
	  console.log("resultsArray:", state.resultsArray);
	  return state.resultsArray;
	}
	
	// returns the airline name, given the airline ID
	var getAirlineName = function(airlineID) {
	  var airlinesArray = res_ss.Carriers;
	  for (var i in airlinesArray) {
	    if (airlineID === airlinesArray[i].CarrierId) {
	      return airlinesArray[i].Name;
	    }
	  }
	}
	
	var addFlightResultToPage = function(flight, results, index) {
	  // console.log("im adding this to div", index);
	  results[index].innerHTML += "<p><b>" + flight.airline + "</b></p>";
	  results[index].innerHTML += "<p>" + "£" + flight.price + "</p>";
	  if (flight.direct) {
	    results[index].innerHTML += "<p>" + "Direct flight" + "</p>";
	  } else {
	    results[index].innerHTML += "<p>" + "Indirect flight" + "</p>";
	  }
	  results[index].innerHTML += "<p>" + "Departure date: " + flight.outboundDate + "</p>";
	  results[index].innerHTML += "<p>" + "Return date: " + flight.inboundDate + "</p>";
	}
	
	var displayHotelResults = function() {
	  var displayHotelsArray = createDisplayHandles(10);
	
	  for (var i = 0; i < displayHotelsArray.length; i++) {
	    if (res_exp.hotelList[i]) { // if there is a valid quote then print it
	      var hotelImageURL = res_exp.hotelList[i].largeThumbnailUrl;
	      var hotelImage = "http://images.travelnow.com" + hotelImageURL
	
	        // NEED TO UPDATE THIS BASED ON USER BUDGET
	        var userBudget = 500;
	
	        var hotel = res_exp.hotelList[i];
	        if(hotel.lowRateInfo.averageRate < userBudget){
	          var hotelResultDetails = {"name": res_exp.hotelList[i].name, "description": res_exp.hotelList[i].shortDescription, "image": hotelImage, "guestRating": res_exp.hotelList[i].hotelGuestRating, "starRating": res_exp.hotelList[i].hotelStarRating, "lat": res_exp.hotelList[i].latitude, "long": res_exp.hotelList[i].longitude, "price": res_exp.hotelList[i].lowRateInfo.total}
	          state.hotelsSelect.push(hotel);
	          // console.log(state.hotelsSelect);
	          addHotelResultToPage(hotelResultDetails, displayHotelsArray, i);
	        }
	      }
	    }
	  }
	
	  var addHotelResultToPage = function(hotel, results, index) {
	    results[index].innerHTML += "<p><b>" + hotel.name + "</b></p>";
	    results[index].innerHTML += "<p>" + "Total Cost: £" + hotel.price + "</p>";
	    results[index].innerHTML += "<img src=" + hotel.image + ">";
	    results[index].innerHTML += "<p>" + hotel.description + "</p>";
	    results[index].innerHTML += "<p>" + "Guest rating: " + hotel.guestRating + "</p>";
	    results[index].innerHTML += "<p>" + "Star rating: " + hotel.starRating + "</p>";
	  }
	
	// NEW STUFF
	var loadCharts = function() {
	  priceBracketData = [];
	  // priceByProximityData = [];
	  var hotelData = res_exp;
	
	  var hotelPriceOptions = hotelData.priceOptions;
	  hotelPriceOptions.splice(-1,1); // remove last item from array
	
	  // var eachHotel = hotelData.hotelList;
	
	  // for (var i = 0; i < eachHotel.length; i++) {
	  //   var distance = eachHotel[i].proximityDistanceInMiles;
	  //   var count = 0;
	  //   if (distance < 1) {
	  //     count += 1;
	  //   }
	  //   console.log(count);
	  //   var cost = eachHotel[i].lowRateInfo.maxNightlyRate;
	    // var starRating = eachHotel[i].hotelStarRating;
	
	  hotelPriceOptions.forEach(function(priceRange) {
	    priceBracketData.push({
	      name: "£" + priceRange.minPrice + " - £" + priceRange.maxPrice,
	      y: priceRange.count
	    });
	  }); 
	
	  new PieChart("Hotels by Price Range", priceBracketData);
	  // new LineChart("Hotel Price by Proximity", priceByProximityData);
	}
	// NEW STUFF
	
	//constructs and displays saved search object
	var displaySavedSearch = function(event){
	
	  var saved = new SavedSearch(state.selectedFlight[0], state.selectedHotel[0]);
	  console.log(saved);
	  var savedResult = document.getElementById('saved')
	  savedResult.innerHTML = "";
	  var carrier = document.createElement('p');
	  var flightPrice = document.createElement('p');
	  var hotelName = document.createElement('p');
	  var hotelPrice = document.createElement('p');
	  var totalPrice = document.createElement('p');
	  var starRating = document.createElement('p');
	
	  carrier.innerText = "Airline : " + saved.flightCarrier;
	  hotelName.innerText = "Hotel : " + saved.hotelName;
	  flightPrice.innerText = "Flight Cost : £" + Math.floor(saved.flightPrice);
	  hotelPrice.innerText = "Accomodation Cost : £" + Math.floor(saved.hotelPrice);
	  starRating.innerHTML = "Hotel Star Rating : " + saved.starRating;
	  var totalCost = Math.floor(saved.flightPrice) + Math.floor(saved.hotelPrice);
	  totalPrice.innerHTML = "Total Package Cost : £" + Math.floor(totalCost);
	
	  savedResult.appendChild(carrier);
	  savedResult.appendChild(hotelName);
	  savedResult.appendChild(starRating);
	  savedResult.appendChild(flightPrice);
	  savedResult.appendChild(hotelPrice);
	  savedResult.appendChild(totalPrice);
	};
	
	var selectedItem = function(e) {
	  console.log(e);
	  var childElement = String(e.target.id);
	  var parentElement = String(e.target.parentNode.id);
	
	  if (childElement.substring(0,6) === "flight") {
	    state.selectedFlight = [];
	    selectedIndex = childElement.substring(13,14);
	    // console.log("the slected index:", state.flightsSelect);
	    state.selectedFlight.push(state.flightsSelect[selectedIndex]);
	    // console.log("123", state.flightsSelect[selectedIndex]);
	  } else if (parentElement.substring(0,6) === "flight") {
	    state.selectedFlight = [];
	    selectedIndex = parentElement.substring(13,14);
	    state.selectedFlight.push(state.flightsSelect[selectedIndex]);
	  } else if (childElement.substring(0,5) === "hotel") {
	    state.selectedHotel = [];
	    selectedIndex = childElement.substring(12,13);
	    state.selectedHotel.push(state.hotelsSelect[selectedIndex]);
	  } else if (parentElement.substring(0,5) === "hotel") {
	    state.selectedHotel = [];
	    selectedIndex = parentElement.substring(12,13);
	    state.selectedHotel.push(state.hotelsSelect[selectedIndex]);
	  }
	  // console.log("selected flight", state.selectedFlight);
	  // console.log("selected hotel", state.selectedHotel);
	}
	
	
	// TO DO LIST:
	// 2. save the users options to db
	// 3. add functionality which enables user to retrieve their previous selections (including the date of the search)
	// 4. maybe add a line chart which shows cost by proximity to city centre, and a pie chart showing the number of hotels
	// 5. add geolocation so that the initial map defaults to the users location
	
	// this.setMapCenter = function(){
	//   navigator.geolocation.getCurrentPosition(function(position) {
	//     var center = {lat: position.coords.latitude, lng: position.coords.longitude};
	//     this.map.map.setCenter(center);
	//   }.bind(this));
	// }
	
	// 6. update the map with points of interest for the chosen destination - display this map as soon as the user enters their chosen options - maybe have POI in blue markers and hotels in red markers
	// 7. style the website - need to add a coloured border around the options that the user selects
	// 8. tidy up some of the code
	// 9. sort the hotel results
	
	// res_exp.hotelList.sort(compare);
	
	// function compare(a, b) {
	//   if (a.lowRateInfo.total < b.lowRateInfo.total) {
	//     return -1;
	//   } else if (a.lowRateInfo.total > b.lowRateInfo.total) {
	//     return 1;
	//   } else {
	//     return 0;
	//   }
	// }
	
	// 10. only display 5 hotel search results at one time

/***/ },
/* 1 */
/***/ function(module, exports) {

	var SavedSearch = function(ssObj, expObj){
	   console.log(expObj, "HEREEEE");
	   this.flightDepDate = ssObj.outboundDate,
	   this.flightRetDate = ssObj.inboundDate,
	   this.flightCarrier = ssObj.airline,
	   this.flightPrice = ssObj.price,
	   this.hotelName =  expObj.localizedName,
	   this.starRating = expObj.hotelStarRating,
	   this.hotelPrice = expObj.lowRateInfo.total
	};
	
	SavedSearch.prototype = {
	   saveToDb: function(saved){
	     // function to save search to database
	   }
	}
	
	module.exports = SavedSearch;

/***/ },
/* 2 */
/***/ function(module, exports) {

	var Map = function(latlng){
	  this.map = new google.maps.Map(document.getElementById('map'),{
	    center: latlng,
	    zoom: 14
	  })
	}
	
	module.exports = Map;

/***/ },
/* 3 */
/***/ function(module, exports) {

	var Place = function(){
	
	}
	
	
	Place.prototype = {
	
	 initMap: function(locations) {
	   // Markers={}
	   var myLatLng = {lat: -25.363, lng: 131.044};
	   var map = new google.maps.Map(document.getElementById('map'), {
	     zoom: 4,
	     center: myLatLng
	   })
	   infowindow = new google.maps.InfoWindow();
	   var bounds = new google.maps.LatLngBounds();
	   for (i = 0; i < locations.length; i++){
	     var marker = new google.maps.Marker({
	       position: new google.maps.LatLng(parseFloat(locations[i][1]), parseFloat(locations[i][2])),
	       map: map,
	       title: locations[i][0]
	     });
	     bounds.extend(marker.position);
	     map.fitBounds(bounds);
	     google.maps.event.addListener(marker, 'click',(function(marker,i){
	      return function(){
	       infowindow.setContent(locations[i][0]);
	       infowindow.setOptions({maxWidth: 200});
	       infowindow.open(map, marker)
	     }
	   })(marker,i));
	     // Markers[locations[i][4]] = marker;
	   }
	 },
	
	populate : function(destination){
	  var url = "http://terminal2.expedia.com/x/activities/search?location=" + destination + "&apikey=fZPSPARW8ZW6Yg738AzbASiN8VPFwVos";
	  var request = new XMLHttpRequest();
	  request.open("GET", url);
	  request.onload = function(){
	    var jsonString = request.responseText;
	    var info = JSON.parse(jsonString);
	
	    var location=[]
	    var arr=[]
	    for (var i=0;i<info.activities.length;i++){
	      var coor = info.activities[i].latLng.split(',')
	      var lat = parseFloat(coor[0])
	      var lang = parseFloat(coor[1])
	      arr=[]
	      arr.push(info.activities[i].title)
	      arr.push(lat)
	      arr.push(lang)
	      location.push(arr)
	    }     
	    this.initMap(location);
	  }.bind(this);
	
	 request.send(null);
	}
	
	}
	
	module.exports = Place;

/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map