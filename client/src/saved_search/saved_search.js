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
   saveToDb: function(){
     // function to save search to database
     // AJAX POST to /savedSearches
     //request.send(savedObject)
     var request = new XMLHttpRequest();
     request.open("POST", '/savedsearches');
     request.setRequestHeader("Content-Type", "application/json");
     console.log(request);
     request.onload = function(){
      if(request.status === 200){
      }
   }
   request.send(JSON.stringify(this));
}
}



module.exports = SavedSearch;