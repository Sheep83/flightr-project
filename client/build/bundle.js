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

	var Map = __webpack_require__(2);
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
	
	  var url_exp = "http://terminal2.expedia.com/x/mhotels/search?city=" + origin + "&checkInDate=" + startDate + "&checkOutDate=" + endDate + "&room1=" + noRoomsValue + "&resultsPerPage=-1&apikey=fZPSPARW8ZW6Yg738AzbASiN8VPFwVos";
	
	  var req_ss = new XMLHttpRequest();
	  req_ss.open("GET", url_ss);
	  req_ss.send(null);
	  req_ss.onload = function(){
	    var res_ss = JSON.parse(req_ss.responseText);
	    console.log(res_ss);
	  }
	
	  var req_exp = new XMLHttpRequest();
	  req_exp.open("GET", url_exp);
	  req_exp.send(null);
	  req_exp.onload = function(){
	    var res_exp = JSON.parse(req_exp.responseText);
	    console.log(res_exp);
	    displayFlightResults();
	    displayHotelResults();
	  }
	}
	
	var displayFlightResults = function() {
	  var flightResult1 = document.getElementById("flight1");
	  var flightResult2 = document.getElementById("flight2");
	  var flightResult3 = document.getElementById("flight3");
	  var flightResult4 = document.getElementById("flight4");
	  var flightResult5 = document.getElementById("flight5");
	}
	
	var displayHotelResults = function() {
	  
	}


/***/ },
/* 1 */,
/* 2 */
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