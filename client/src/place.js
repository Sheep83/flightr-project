var Place = function(){

}


Place.prototype = {

  initMap: function(locations) {
    // Markers={}
    var myLatLng = {lat: -25.363, lng: 131.044};
    var map = new google.maps.Map(document.getElementById('map'), {
      zoom: 4,
      center: myLatLng
    })
    infowindow = new google.maps.InfoWindow();
    var bounds = new google.maps.LatLngBounds();
    for (i = 0; i < locations.length; i++){
      var marker = new google.maps.Marker({
        position: new google.maps.LatLng(parseFloat(locations[i][1]), parseFloat(locations[i][2])),
        map: map,
        title: locations[i][0]
      });
      bounds.extend(marker.position);
      map.fitBounds(bounds);
      google.maps.event.addListener(marker, 'click',(function(marker,i){
       return function(){
        infowindow.setContent(locations[i][0]);
        infowindow.setOptions({maxWidth: 200});
        infowindow.open(map, marker)
      }
    })(marker,i));
      // Markers[locations[i][4]] = marker;
    }
  },

 populate : function(destination){
   var url = "http://terminal2.expedia.com/x/activities/search?location=" + destination + "&apikey=fZPSPARW8ZW6Yg738AzbASiN8VPFwVos";
   var request = new XMLHttpRequest();
   request.open("GET", url);
   request.onload = function(){
     var jsonString = request.responseText;
     var info = JSON.parse(jsonString);

     var location=[]
     var arr=[]
     for (var i=0;i<info.activities.length;i++){
       var coor = info.activities[i].latLng.split(',')
       var lat = parseFloat(coor[0])
       var lang = parseFloat(coor[1])
       arr=[]
       arr.push(info.activities[i].title)
       arr.push(lat)
       arr.push(lang)
       location.push(arr)
     }     
     this.initMap(location);
   }.bind(this);

  request.send(null);
 }

}

module.exports = Place;