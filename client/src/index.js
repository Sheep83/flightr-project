var Map = require('./map');
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
  var displayFlightsArray = createDisplayHandles();

  for (var i = 0; i < displayFlightsArray.length; i++) {
    if (res_ss.Quotes[i]) { // if there is a valid quote then print it
      // but only if the trip has an inbound and outbound journey
      if (res_ss.Quotes[i].InboundLeg && res_ss.Quotes[i].OutboundLeg) {
        var airlineID = res_ss.Quotes[i].InboundLeg.CarrierIds[0];
        var airlineName = getAirlineName(airlineID);

        var flightResultDetails = {"price": res_ss.Quotes[i].MinPrice, "direct": res_ss.Quotes[i].Direct, "outboundDate": res_ss.Dates.OutboundDates[0].PartialDate, "inboundDate": res_ss.Dates.InboundDates[0].PartialDate, "airline": airlineName}
        addResultToPage(flightResultDetails, displayFlightsArray, i);
      } else {
        continue;
      }
      }
  }
}

// gets a handle on the divs used to display the flight results
var createDisplayHandles = function() {
  var resultsArray = [];
  resultsArray[0] = document.getElementById("flight-result1");
  resultsArray[1] = document.getElementById("flight-result2");
  resultsArray[2] = document.getElementById("flight-result3");
  resultsArray[3] = document.getElementById("flight-result4");
  resultsArray[4] = document.getElementById("flight-result5");
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

var addResultToPage = function(flight, results, index) {
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

}