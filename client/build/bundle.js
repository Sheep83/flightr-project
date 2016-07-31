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

	var Map = __webpack_require__(1);
	window.onload = function(){
	
	  var button = document.getElementById('button');
	  button.onclick = function(){
	    origin = document.getElementById('origin').value;
	    destination = document.getElementById('destination').value;
	    startDate = document.getElementById('start-date').value;
	    endDate = document.getElementById('end-date').value;
	    noRooms = document.getElementById('no-rooms');
	    noRoomsValue = noRooms.options[noRooms.selectedIndex].text;
	    sendOriginRequest();
	
	    var center = {lat: 55.9533, lng: -3.1883};
	    var map = new Map(center);
	    console.log(map);
	  }
	
	  var center = {lat: 55.9533, lng: -3.1883};
	  var map = new Map(center);
	};
	
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
	    console.log(ss_destination);
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
	    console.log(res_exp);
	    displayFlightResults();
	    displayHotelResults();
	  }
	}
	
	
	
	
	
	var displayFlightResults = function() {
	  var displayFlightsArray = createDisplayHandles(5, "flight");
	
	  for (var i = 0; i < displayFlightsArray.length; i++) {
	    if (res_ss.Quotes[i]) { // if there is a valid quote then print it
	      // but only if the trip has an inbound and outbound journey
	      if (res_ss.Quotes[i].InboundLeg && res_ss.Quotes[i].OutboundLeg) {
	        var airlineID = res_ss.Quotes[i].InboundLeg.CarrierIds[0];
	        var airlineName = getAirlineName(airlineID);
	
	        var flightResultDetails = {"price": res_ss.Quotes[i].MinPrice, "direct": res_ss.Quotes[i].Direct, "outboundDate": res_ss.Dates.OutboundDates[0].PartialDate, "inboundDate": res_ss.Dates.InboundDates[0].PartialDate, "airline": airlineName}
	        addFlightResultToPage(flightResultDetails, displayFlightsArray, i);
	      } else {
	        continue;
	      }
	      }
	  }
	}
	
	// gets a handle on the divs used to display the flight and hotel results
	var createDisplayHandles = function(size, type) {
	  var resultsArray = [];
	
	  for (var i = 0; i < size; i++) {
	    if (type === "flight") {
	      resultsArray[i] = document.getElementById('flight-result' + (i + 1));
	    } else {
	      resultsArray[i] = document.getElementById('hotel-result' + (i + 1));
	    }
	  }
	  return resultsArray;
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
	
	        var hotelResultDetails = {"name": res_exp.hotelList[i].name, "description": res_exp.hotelList[i].shortDescription, "image": hotelImage, "guestRating": res_exp.hotelList[i].hotelGuestRating, "starRating": res_exp.hotelList[i].hotelStarRating, "lat": res_exp.hotelList[i].latitude, "long": res_exp.hotelList[i].longitude}
	        addHotelResultToPage(hotelResultDetails, displayHotelsArray, i);
	      }
	  }
	}
	
	var addHotelResultToPage = function(hotel, results, index) {
	  results[index].innerHTML += "<p><b>" + hotel.name + "</b></p>";
	  results[index].innerHTML += "<img src=" + hotel.image + ">";
	  results[index].innerHTML += "<p>" + hotel.description + "</p>";
	  results[index].innerHTML += "<p>" + "Guest rating: " + hotel.guestRating + "</p>";
	  results[index].innerHTML += "<p>" + "Star rating: " + hotel.starRating + "</p>";
	}

/***/ },
/* 1 */
/***/ function(module, exports) {

	var Map = function(latlng){
	  this.map = new google.maps.Map(document.getElementById('map'),{
	    center: latlng,
	    zoom: 14
	  })
	}
	
	module.exports = Map;

/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map