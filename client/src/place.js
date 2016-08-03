var Place = function(){
var myLatLng = {lat: -25.363, lng: 131.044};
this.map = new google.maps.Map(document.getElementById('map'), {
    zoom: 30,
    center: myLatLng
  })
}

// this.map.addControl(new LegendControl({
//     mgr          : mgr,
//     markerGroups : markerGroups,
//     legendValues : legendValues
//   }));




Place.prototype = {

 initMap: function(locations) {
  for (var i = 0;i<locations.length; i++) {
   if(locations[i][3].type==='trip'){
     icon = "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
   }else if (locations[i][3].type==='hotel') {
    icon = "http://maps.google.com/mapfiles/ms/icons/green-dot.png"
  }
}

   infowindow = new google.maps.InfoWindow();
   var bounds = new google.maps.LatLngBounds();
   console.log(locations[0][5])
   for (i = 0; i < locations.length; i++){
     var marker = new google.maps.Marker({
       position: new google.maps.LatLng(parseFloat(locations[i][1]), parseFloat(locations[i][2])),
       map: this.map,
       // title: ('<IMG BORDER="0" ALIGN="Left" SRC="http://images.travelnow.com'+locations[0][5]+'">' + " " +locations[i][0] + " "+ "<p>" +locations[i][4]),
       animation: google.maps.Animation.DROP,
       icon: new google.maps.MarkerImage(icon)
       // infoWindow:{ content: "<b>Loop, Inc.</b>"}
     });
     bounds.extend(marker.position);
     this.map.fitBounds(bounds);
     google.maps.event.addListener(marker, 'click',(function(marker,i){
      return function(){ 
       infowindow.setContent('<IMG BORDER="0" ALIGN="Left" SRC="http://images.travelnow.com'+locations[i][5]+'">' + " " +locations[i][0] + " "+ "<p>" +locations[i][4]);
       infowindow.setOptions({maxWidth: 200});
       infowindow.open(map, marker)
     }
   })(marker,i));
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
      arr.push({type: 'trip'})
      location.push(arr)
    }     
    this.initMap(location);
  }.bind(this);

 request.send(null);
}

}



module.exports = Place;