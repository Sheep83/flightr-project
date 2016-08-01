var SavedSearch = require('./saved_search/saved_search');
var Map = require('./map');

//not added iains stuff to state
var state = {
  'flightsSelect': [],
  "selectedFlight": [],
  // "selectedFlight":[],
  "hotelsSelect": [],
  "selectedHotel": [],
  "savedSearch": [],
  "latLng": [],
}

window.onload = function(){

  var button = document.getElementById('button');
  var packageButton = document.getElementById('package-button');
  button.onclick = function(){
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
  }

  packageButton.onclick = function(){
    if (state.selectedFlight.length === 0 || state.selectedHotel.length === 0) {
      alert("You haven't selected a valid flight and hotel. Please try again.");
    } else {
      console.log("Need to display this");
      displaySavedSearch();
      // NEED TO SAVE TO DB
    }
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
  var resultsArray = [];
  // these are global so not overwritten on each click
  userSelectedFlights = [];
  userSelectedHotels = [];

  for (var i = 0; i < size; i++) {
    if (type === "flight") {
      resultsArray[i] = document.getElementById('flight-result' + (i));
      resultsArray[i].onclick=function(e){ selectedItem(e) };
      // NEED TO STOP THIS REGISTERING CLICK WHEN CHILD ELEMENTS ARE CLICKED
    } else {
      resultsArray[i] = document.getElementById('hotel-result' + (i));
      resultsArray[i].onclick=function(e){ selectedItem(e) };
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
// BEFORE ANYTHING ELSE - COMBINE WHAT WE HAVE AND GET IT WORKING/ON GITHUB
// 1. add a click to buy button, which appears when options are selected. This should link to expedia and skyscanner and ideally populate a search query for the chosen flight/hotel
// 2. save the users options to db
// 3. add functionality which enables user to retrieve their previous selections (including the date of the search)
// 4. maybe add a line chart which shows cost by proximity to city centre, and a pie chart showing the number of hotels
// 5. add geolocation so that the initial map defaults to the users location
// 6. update the map with points of interest for the chosen destination - display this map as soon as the user enters their chosen options - maybe have POI in blue markers and hotels in red markers
// 7. style the website - need to add a coloured border around the options that the user selects
// 8. tidy up some of the code
// 9. sort the hotel results by value for money (taking into account proximity, star rating and cost)
// 10. only display 5 hotel search results at one time