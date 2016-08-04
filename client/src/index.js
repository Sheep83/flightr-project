var Place = require('./place');
var SavedSearch = require('./saved_search/saved_search');
var Map = require('./map');
var Place = require('./place');

//not added iains stuff to state
var state = {
  'flightsSelect': [],
  "selectedFlight": [],
  // "selectedFlight":[],
  "hotelsSelect": [],
  "selectedHotel": [],
  "savedSearch": [],
  "latLng": [],
  "resultsArray": [],
  "origin": [],
  "destination": [],
  "dbSearches": []
}

window.onload = function(){
  var request = new XMLHttpRequest();
  request.open("GET", '/savedsearches');
  request.setRequestHeader("Content-Type", "application/json");
   // console.log(request);
   request.onload = function(){
     if(request.status === 200){
       var searches = JSON.parse(request.responseText)
     }
     // console.log(searches);
     searches.forEach(function(item, index){
      state.dbSearches.push(item);
    })
     savedDiv = document.getElementById('dbResults');
     searches.forEach(function(item, index){
      savedSubDiv = document.createElement('p');
      savedSubDiv.id = index;
      savedSubDiv.class = 'savedSubDiv';
      savedSubDiv.innerHTML = "Airline: " + item.flightCarrier + "<br>Hotel: " + item.hotelName + "<br>Origin: " + item.origin + "<br>Destination: " + item.destination;
      savedDiv.appendChild(savedSubDiv);
      var viewButton = document.createElement('button');
      viewButton.id = index;
      viewButton.innerText = "View Quote";
      console.log(viewButton.id)
      savedSubDiv.appendChild(viewButton);
      viewButton.onclick = updateSavedSearch;

    })
   }
   request.send(null);

   var button = document.getElementById('button');
   var packageButton = document.getElementById('package-button');
   button.onclick = function(){
    clearPreviousSearch();
    var displaySearchResults = document.getElementById('combined-results').style.display = 'inline-block';
    origin = document.getElementById('origin').value;
    state.origin.push(origin);
    destination = document.getElementById('destination').value;
    state.destination.push(destination);
    startDate = document.getElementById('start-date').value;
    endDate = document.getElementById('end-date').value;
    noRooms = document.getElementById('no-rooms');
    budget = document.getElementById('range').innerHTML;
    noRoomsValue = noRooms.options[noRooms.selectedIndex].text;
    sendOriginRequest();
    var place = new Place();
    place.populate(destination);
    dest=[]
    arr=[]

    setTimeout(function(){
     for(i=0; i<state.hotelsSelect.length;i++){
      arr.push(state.hotelsSelect[i].name);
      arr.push(parseFloat(state.hotelsSelect[i].latitude));
      arr.push(parseFloat(state.hotelsSelect[i].longitude));
      arr.push({type: 'hotel'})
      arr.push(state.hotelsSelect[i].shortDescription)
      arr.push(state.hotelsSelect[i].thumbnailUrl)  
      dest.push(arr)
      arr=[]
    }  
    // console.log(dest)
    populatehotel(dest)
  },7000);
    function populatehotel(arr){
      place.initMap(dest)
    }
    var viewCharts = document.getElementById('mapChart').scrollIntoView();
  }

  packageButton.onclick = function(){
    if (state.selectedFlight.length === 0 || state.selectedHotel.length === 0) {
      alert("You haven't selected a valid flight and hotel. Please try again.");
    } else {
      // location.href='#saved-search-display';
      var displayPreviousSearches = document.getElementById('dbResults').style.display = 'inline-block';
      displaySavedSearch();
      var displayTable = document.getElementById('saved-search-display').style.display = 'inline-block';
      var displayDBButton = document.getElementById('view-db-results-button').style.display = 'block';
      var getSearchTable = document.getElementById('view-table').scrollIntoView();
    }
  }


  var center = {lat: 55.9533, lng: -3.1883};
  var map = new Map(center);
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
  clearPreviousSelection();
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

var clearPreviousSelection = function() {
  var userSelection = document.getElementById('saved').innerHTML = "";
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
    sendSearchRequests();
  }
}

var sendSearchRequests = function() {
  var url_ss = "http://partners.api.skyscanner.net/apiservices/browsedates/v1.0/GB/GBP/en-GB/" + ss_origin + "/" + ss_destination + "/" + startDate + "/" + endDate + "?apiKey=co666659065635714271429118382522";

  var url_exp = "http://terminal2.expedia.com/x/mhotels/search?city=" + destination + "&checkInDate=" + startDate + "&checkOutDate=" + endDate + "&room1=" + 2 + "&resultsPerPage=-1&apikey=fZPSPARW8ZW6Yg738AzbASiN8VPFwVos";

  var req_ss = new XMLHttpRequest();
  req_ss.open("GET", url_ss);
  req_ss.send(null);
  req_ss.onload = function(){
    res_ss = JSON.parse(req_ss.responseText);
  }

  var req_exp = new XMLHttpRequest();
  req_exp.open("GET", url_exp);
  req_exp.send(null);
  req_exp.onload = function(){

    res_exp = JSON.parse(req_exp.responseText);
    var hotelListArray = res_exp.hotelList;

    // console.log(hotelListArray);
    // for (var i = 0; i < hotelListArray.length; i++) {
    //   if (hotelListArray[i].lowRateInfo === undefined) {
    //     console.log("this is undefined");
    //   }
    // }

   //  console.log("hotelListArray", hotelListArray);
   var sorted_hotels = hotelListArray.sort(function(a, b){
    return a.lowRateInfo.total - b.lowRateInfo.total;     
  })

   loadCharts();
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

  for (var i = 0; i < size; i++) {
    if (type === "flight") {
      state.resultsArray[i] = document.getElementById('flight-result' + (i));
      state.resultsArray[i].onclick=function(e){ 
        selectedItem(e);
      };
      // NEED TO STOP THIS REGISTERING CLICK WHEN CHILD ELEMENTS ARE CLICKED
    } else {
      state.resultsArray[i] = document.getElementById('hotel-result' + (i));
      state.resultsArray[i].onclick=function(e){ 
        selectedItem(e);
      };
    }
  }
  // console.log("resultsArray:", state.resultsArray);
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
        var hotel = res_exp.hotelList[i];
        // console.log("hotel list", hotel);

        if(hotel.lowRateInfo.averageRate < parseInt(budget)){
          var hotelResultDetails = {"name": res_exp.hotelList[i].name, "description": res_exp.hotelList[i].shortDescription, "image": hotelImage, "guestRating": res_exp.hotelList[i].hotelGuestRating, "starRating": res_exp.hotelList[i].hotelStarRating, "lat": res_exp.hotelList[i].latitude, "long": res_exp.hotelList[i].longitude, "price": res_exp.hotelList[i].lowRateInfo.total}
          state.hotelsSelect.push(hotel);
          // console.log(state.hotelsSelect);
          // console.log(state.hotelsSelect);
          // console.log("BUDGET", typeof budget);
          addHotelResultToPage(hotelResultDetails, displayHotelsArray, i);
        }
      }
    }
  }

  var addHotelResultToPage = function(hotel, results, index) {
    results[index].innerHTML += "<p><b>" + hotel.name + "</b></p>";
    results[index].innerHTML += "<p>" + "Cost Per Room (Based on 2 people sharing): £" + hotel.price + "</p>";
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
  var saved = new SavedSearch(state.selectedFlight[0], state.selectedHotel[0], state.origin[0], state.destination[0], noRoomsValue);
  saved.saveToDb();
  // console.log("SAVED", saved);
  var savedResult = document.getElementById('saved');
  savedResult.innerHTML = "";
  
  // new stuff
  // need to clear this on next submit
  var from = document.getElementById('from');
  var to = document.getElementById('to');
  var departureDate = document.getElementById('departure-date');
  var arrivalDate = document.getElementById('arrival-date');
  var numPeople = document.getElementById('num-people');
  var airline = document.getElementById('airline');
  var flightCost = document.getElementById('flight-cost');
  var hotelName = document.getElementById('hotel');
  var starRating = document.getElementById('star-rating');
  var numRooms = document.getElementById('num-rooms');
  var costPerRoom = document.getElementById('cost-per-room');
  var flightSubtotal = document.getElementById('flight-subtotal');
  var hotelSubtotal = document.getElementById('hotel-subtotal');
  var totalCost = document.getElementById('total-cost');
  var flightSubtotalFull = document.getElementById('flight-subtotal-full');
  var hotelSubtotalFull = document.getElementById('hotel-subtotal-full');

  var numberRooms = 0;
  if (saved.numPeople == 1 || saved.numPeople == 2) {
    numberRooms = 1;
  } else if (saved.numPeople == 3 || saved.numPeople == 4) {
    numberRooms = 2;
  } else {
    numberRooms = 3;
  }

  from.innerHTML = saved.origin;
  to.innerHTML = saved.destination;
  departureDate.innerHTML = saved.flightDepDate;
  arrivalDate.innerHTML = saved.flightRetDate;
  numPeople.innerHTML = saved.numPeople;
  airline.innerHTML = saved.flightCarrier;
  flightCost.innerHTML = "£" + saved.flightPrice.toFixed(2);
  hotelName.innerHTML = saved.hotelName;
  starRating.innerHTML = saved.starRating;
  numRooms.innerHTML = numberRooms;
  costPerRoom.innerHTML = "£" + saved.hotelPrice;
  flightSubtotalFull.innerHTML = saved.numPeople + " x " + saved.flightPrice.toFixed(2);
  flightSubtotal.innerHTML = "£" + (saved.flightPrice * saved.numPeople).toFixed(2);
  hotelSubtotal.innerHTML = "£" + (saved.hotelPrice * numberRooms).toFixed(2);
  hotelSubtotalFull.innerHTML = numberRooms + " x " + saved.hotelPrice;
  totalCost.innerHTML = "£" + ((saved.flightPrice * saved.numPeople) + (saved.hotelPrice * numberRooms)).toFixed(2);

  // new stuff

  // var carrier = document.createElement('p');
  // var flightPrice = document.createElement('p');
  // var hotelName = document.createElement('p');
  // var hotelPrice = document.createElement('p');
  // var totalPrice = document.createElement('p');
  // var starRating = document.createElement('p');
  // var numberPeople = document.createElement('p');

  // carrier.innerText = "Airline : " + saved.flightCarrier;
  // hotelName.innerText = "Hotel : " + saved.hotelName;
  // numberPeople.innerText = "Number of People : " + saved.numPeople;
  // flightPrice.innerText = "Flight Cost Per Person : £" + Math.floor(saved.flightPrice);



  // console.log("numPeople", saved.numPeople);
  // hotelPrice.innerText = "Accomodation Cost Per Room (2 people) : £" + Math.floor(saved.hotelPrice);
  // starRating.innerHTML = "Hotel Star Rating : " + saved.starRating;
  // var totalCost = Math.floor(saved.flightPrice * saved.numPeople) + Math.floor(saved.hotelPrice * numberRooms);
  // totalPrice.innerHTML = "Total Package Cost : £" + Math.floor(totalCost);

  // savedResult.appendChild(carrier);
  // savedResult.appendChild(hotelName);
  // savedResult.appendChild(starRating);
  // savedResult.appendChild(numberPeople);
  // savedResult.appendChild(flightPrice);
  // savedResult.appendChild(hotelPrice);
  // savedResult.appendChild(totalPrice);
};

var updateSavedSearch = function(event){
 console.log(event);
 console.log('clicked');
 search = state.dbSearches[event.target.id];
 var savedResult = document.getElementById('saved');
 savedResult.innerHTML = "";
 var from = document.getElementById('from');
 var to = document.getElementById('to');
 var departureDate = document.getElementById('departure-date');
 var arrivalDate = document.getElementById('arrival-date');
 var numPeople = document.getElementById('num-people');
 var airline = document.getElementById('airline');
 var flightCost = document.getElementById('flight-cost');
 var hotelName = document.getElementById('hotel');
 var starRating = document.getElementById('star-rating');
 var numRooms = document.getElementById('num-rooms');
 var costPerRoom = document.getElementById('cost-per-room');
 var flightSubtotal = document.getElementById('flight-subtotal');
 var hotelSubtotal = document.getElementById('hotel-subtotal');
 var totalCost = document.getElementById('total-cost');
 var flightSubtotalFull = document.getElementById('flight-subtotal-full');
 var hotelSubtotalFull = document.getElementById('hotel-subtotal-full');

 var numberRooms = 0;
 if (search.numPeople == 1 || search.numPeople == 2) {
   numberRooms = 1;
 } else if (search.numPeople == 3 || search.numPeople == 4) {
   numberRooms = 2;
 } else {
   numberRooms = 3;
 }

 from.innerHTML = search.origin;
 to.innerHTML = search.destination;
 departureDate.innerHTML = search.flightDepDate;
 arrivalDate.innerHTML = search.flightRetDate;
 numPeople.innerHTML = search.numPeople;
 airline.innerHTML = search.flightCarrier;
 flightCost.innerHTML = "£" + search.flightPrice.toFixed(2);
 hotelName.innerHTML = search.hotelName;
 starRating.innerHTML = search.starRating;
 numRooms.innerHTML = numberRooms;
 costPerRoom.innerHTML = "£" + search.hotelPrice;
 flightSubtotalFull.innerHTML = search.numPeople + " x " + search.flightPrice.toFixed(2);
 flightSubtotal.innerHTML = "£" + (search.flightPrice * search.numPeople).toFixed(2);
 hotelSubtotal.innerHTML = "£" + (search.hotelPrice * numberRooms).toFixed(2);
 hotelSubtotalFull.innerHTML = numberRooms + " x " + search.hotelPrice;
 totalCost.innerHTML = "£" + ((search.flightPrice * search.numPeople) + (search.hotelPrice * numberRooms)).toFixed(2);
 var scrollToTable = document.getElementById('view-table').scrollIntoView();
};

var selectedItem = function(e) {
  // console.log(e);
  var childElement = String(e.target.id);
  var parentElement = String(e.target.parentNode.id);
  var childElementHandle = document.getElementById(childElement);
  var parentElementHandle = document.getElementById(parentElement);
  var flightSize = 5;
  var hotelSize = 10;

  if (childElement.substring(0,6) === "flight") {
    state.selectedFlight = [];
    selectedIndex = childElement.substring(13,14);
    // console.log("the slected index:", state.flightsSelect);
    state.selectedFlight.push(state.flightsSelect[selectedIndex]);
    // console.log("ceh", e.target.id);
    clearFlightBorders(flightSize);
    childElement.style.border="5px solid #3a7999";
    // console.log("123", state.flightsSelect[selectedIndex]);
  } else if (parentElement.substring(0,6) === "flight") {
    state.selectedFlight = [];
    selectedIndex = parentElement.substring(13,14);
    state.selectedFlight.push(state.flightsSelect[selectedIndex]);
    // console.log("peh", e.target.id);
    clearFlightBorders(flightSize);
    parentElementHandle.style.border="5px solid #3a7999";
  } else if (childElement.substring(0,5) === "hotel") {
    state.selectedHotel = [];
    // console.log("should empty hotel here");
    // console.log("selected hotel", state.selectedHotel);
    selectedIndex = childElement.substring(12,13);
    state.selectedHotel.push(state.hotelsSelect[selectedIndex]);
    // console.log("ceh", e.target.id);
    clearHotelBorders(hotelSize);
    childElementHandle.style.border="5px solid #3a7999";

    // console.log("the index is", selectedIndex);
    // console.log("child", childElement);
    // console.log("parent", parentElement);
    // console.log("the hotel pushed is", state.hotelsSelect[selectedIndex]);
  } else if (parentElement.substring(0,5) === "hotel") {
    state.selectedHotel = [];
    // console.log("should empty hotel here");
    // console.log("selected hotel", state.selectedHotel);
    selectedIndex = parentElement.substring(12,13);
    state.selectedHotel.push(state.hotelsSelect[selectedIndex]);
    // console.log("peh", e.target.id);
    clearHotelBorders(hotelSize);
    parentElementHandle.style.border="5px solid #3a7999";
    // console.log("the index is", selectedIndex);
    // console.log("child", childElement);
    // console.log("parent", parentElement);
    // console.log("the hotel pushed is", state.hotelsSelect[selectedIndex]);
  }
}

var clearFlightBorders = function(size) {
 var flightArray = [];
 for (var i = 0; i < size; i++) {
   flightArray[i] = document.getElementById('flight-result' + (i)).style.border="0";
 }
}

var clearHotelBorders = function(size) {
  var hotelArray = [];
  for (var i = 0; i < size; i++) {
    hotelArray[i] = document.getElementById('hotel-result' + (i)).style.border="0";
  }
}