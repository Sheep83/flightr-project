var assert = require('assert');
var SavedSearch = require('../saved_search/saved_search');

describe('saved search', function(){
  it('can be created', function(){
    var search = new SavedSearch({
   flightDepDate: "2016-09-16",
   flightRetDate: "2016-09-26",
   flightCarrier: "Air India",
   flightPrice: 500,
   hotelName: "Meadowlands Plaza Hotel",
   starRating: "2.5",
   hotelPrice: 400,
   origin: "London",
   destination: "New York"
})
  assert.equal(400, search.hotelPrice)
});