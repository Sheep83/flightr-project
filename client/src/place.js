var Place = function(){
  var myLatLng = {lat: -25.363, lng: 131.044};
  this.map = new google.maps.Map(document.getElementById('map'), {
    zoom: 4,
    center: myLatLng
  });

var leg = document.createElement("div");
leg.setAttribute("id","legend");

var iconBase = 'http://maps.google.com/mapfiles/kml/pal2/';
        
var icons = {
  hotel: {
    name: 'Hotel',
    icon: iconBase + 'icon20.png'
  },
  Event: {
    name: 'Event',
    icon: iconBase + 'icon57.png'
  }
};
    
var legend = document.getElementById('legend');


for (var key in icons) {
  var type = icons[key];
  var name = type.name;
  var icon = type.icon;

  var div = document.createElement('div');
  div.innerHTML = '<img src="' + icon + '"> ' + name;
  
  legend.appendChild(div);
}
  this.map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(legend);   
  legend.removeAttribute('hidden'); 


}



Place.prototype = {

 initMap: function(locations) {
  for (var i = 0;i<locations.length; i++) {
   if(locations[i][3].type==='trip'){
     icon = "http://maps.google.com/mapfiles/kml/pal2/icon57.png"
   }else if (locations[i][3].type==='hotel') {
 
    icon = "http://maps.google.com/mapfiles/kml/pal2/icon20.png"
  }
}

   infowindow = new google.maps.InfoWindow();
   var bounds = new google.maps.LatLngBounds();
   for (i = 0; i < locations.length; i++){
     var marker = new google.maps.Marker({
       position: new google.maps.LatLng(parseFloat(locations[i][1]), parseFloat(locations[i][2])),
       map: this.map,
       // title: locations[i][0],
       animation: google.maps.Animation.DROP,
       icon: new google.maps.MarkerImage(icon)
     });
     bounds.extend(marker.position);
     this.map.fitBounds(bounds);
     google.maps.event.addListener(marker, 'click',(function(marker,i){
      return function(){ 
       infowindow.setContent('<IMG BORDER="0" ALIGN="Left" SRC="http://images.travelnow.com'+locations[i][5]+'">' + " " +"<b>"+locations[i][0] + "</b>" +  "<p>" +locations[i][4]);
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
      arr.push("Event in town")
      arr.push("/hotels/11000000/10510000/10504400/10504306/10504306_46_n.jpg")
      location.push(arr)
    }     
    this.initMap(location);
  }.bind(this);

 request.send(null);
}



}



module.exports = Place;