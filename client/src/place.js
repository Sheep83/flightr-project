var Place = function(){
this.places=[]
this.onUpdate = null;
this.storageKey='event';
}
Place.prototype = {
 populate : function(destination){
   var url = "http://terminal2.expedia.com/x/activities/search?location=" + destination + "&apikey=fZPSPARW8ZW6Yg738AzbASiN8VPFwVos";
   console.log(url);
   var request = new XMLHttpRequest();
   request.open("GET", url);
   request.onload = function(){
     var jsonString = request.responseText;
     var info = JSON.parse(jsonString);
     console.log(info)
     this.places = info;
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
             localStorage.setItem('event', JSON.stringify(location))
           }

           request.send(null);
         },
         get:function(){
           var event = localStorage.getItem('event')
           return JSON.parse(event)
         }

       }

module.exports = Place;