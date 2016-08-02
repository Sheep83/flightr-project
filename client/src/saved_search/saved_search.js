var SavedSearch = function(ssObj, expObj, numPeople){
   this.flightDepDate = ssObj.outboundDate,
   this.flightRetDate = ssObj.inboundDate,
   this.flightCarrier = ssObj.airline,
   this.flightPrice = ssObj.price,
   this.hotelName =  expObj.localizedName,
   this.starRating = expObj.hotelStarRating,
   this.hotelPrice = expObj.lowRateInfo.total,
   this.numPeople = numPeople
};

SavedSearch.prototype = {
   saveToDb: function(saved){
     // function to save search to database
   }
}

module.exports = SavedSearch;