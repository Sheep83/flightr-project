var Map = function(latlng){
  this.map = new google.maps.Map(document.getElementById('map'),{
    center: latlng,
    zoom:18
  })
}

module.exports = Map;