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

	var Map = __webpack_require__(1)
	
	window.onload = function(){
	  // console.log('window loaded');
	 
	
	
	  var url_ss = "http://partners.api.skyscanner.net/apiservices/browsedates/v1.0/GB/GBP/en-GB/LON/JFK/2016-08-02/2016-08-04?apiKey=prtl6749387986743898559646983194"
	
	  var url_exp = "http://terminal2.expedia.com/x/mhotels/search?city=berlin&checkInDate=2016-12-15&checkOutDate=2016-12-17&sortOrder=true&room1=2&apikey=fZPSPARW8ZW6Yg738AzbASiN8VPFwVos"
	
	  var req_ss = new XMLHttpRequest();
	  req_ss.open("GET", url_ss);
	  // request.setRequestHeader('accept', 'application/json');
	  req_ss.send(null);
	  req_ss.onload = function(){
	    var res_ss = JSON.parse(req_ss.responseText);
	    console.log(res_ss);
	  }
	  var req_exp = new XMLHttpRequest();
	  req_exp.open("GET", url_exp);
	  // request.setRequestHeader('accept', 'application/json');
	  req_exp.send(null);
	  req_exp.onload = function(){
	    var res_exp = JSON.parse(req_exp.responseText);
	    console.log(res_exp);
	
	    console.log(res_exp.hotelList[0].lowRateInfo.total);
	   
	  }
	  var center = {lat: 51.507351, lng: -0.127758};
	  var map = new Map(center);
	  
	
	}
	


/***/ },
/* 1 */
/***/ function(module, exports) {

	var Map = function(latlng){
	  this.map = new google.maps.Map(document.getElementById('map'),{
	    center: latlng,
	    zoom:18
	  })
	}
	
	module.exports = Map;

/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map