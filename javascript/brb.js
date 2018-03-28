console.log ("let's go")
// checking the js link

var latitude = '';
var longitude = '';

  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyBw74DNtaJAI7bfQW5VLX6BW7I14OmqAQ0",
    authDomain: "bike-right-back.firebaseapp.com",
    databaseURL: "https://bike-right-back.firebaseio.com",
    projectId: "bike-right-back",
    storageBucket: "bike-right-back.appspot.com",
    messagingSenderId: "124313717233"
  };
  firebase.initializeApp(config);

function locationSearch(event) {
event.preventDefault();

console.log("working");
var address = $("#search").val().trim();
$.ajax({
  url: "https://maps.googleapis.com/maps/api/geocode/json?address=" + address + "&key=AIzaSyBG8dPTg52rH0rTtwIR6a-Bl1DWiELwY1M",
  method: 'GET'
}).then(function(response){
    console.log();
    latitude = response.results[0].geometry.location.lat;
    console.log(response.results[0].geometry.location.lng)
    longitude = response.results[0].geometry.location.lng;
})
}

function initMap() {
  var uluru = {lat:42.0166702, lng: 23.1000004};
  var map = new google.maps.Map(document.querySelector(".search-field"), {
    zoom: 4,
    center: uluru
    
  });
  var marker = new google.maps.Marker({
    position: uluru,
    map: map
  });
}

$("#search").on("click", locationSearch);
+$("#search").on("click", locationSearch); 
$(function () {
    var $bikes = $('#bikes');

    $.ajax({
        type: 'GET',
        url: 'https://bikeindex.org/api/v3/search?page=1&per_page=25&location=IP&distance=10&stolenness=stolen',
        dataType: 'json',
        cache: false,
        success: function (data) {
            $(data.bikes).each(function (index, value) {
                console.log(value);
            });
        }
    });
});
