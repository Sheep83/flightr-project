window.onload = function(){
  // console.log('window loaded');

  var url_ss = "http://partners.api.skyscanner.net/apiservices/browsedates/v1.0/GB/GBP/en-GB/LON/JFK/2016-08-02/2016-08-04?apiKey=prtl6749387986743898559646983194"

  var url_exp = "http://terminal2.expedia.com/x/mhotels/search?city=berlin&checkInDate=2016-12-15&checkOutDate=2016-12-17&sortOrder=true&room1=2&apikey=fZPSPARW8ZW6Yg738AzbASiN8VPFwVos"

  var req_ss = new XMLHttpRequest();
  req_ss.open("GET", url_ss);
  // request.setRequestHeader('accept', 'application/json');
  req_ss.send(null);
  req_ss.onload = function(){
    var res_ss = JSON.parse(req_ss.responseText);
    console.log(res_ss.Places[0].CityName);
  }
  // var req_exp = new XMLHttpRequest();
  // req_exp.open("GET", url_exp);
  // // request.setRequestHeader('accept', 'application/json');
  // req_exp.send(null);
  // req_exp.onload = function(){
  //   var res_exp = JSON.parse(req_exp.responseText);
  //   console.log(res_exp);

  //   console.log(res_exp.hotelList[0].lowRateInfo.total);
  // }

  

}

