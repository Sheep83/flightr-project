var SavedSearch = function(ssObj, expObj){
   console.log(ssObj, "HEREEEE1");
   console.log(expObj, "HEREEEE2");
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