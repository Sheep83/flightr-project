var Map = function(latlng){
  this.map = new google.maps.Map(document.getElementById('map'),{
    center: latlng,
    zoom: 14
  })
}

module.exports = Map;