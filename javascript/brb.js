console.log ("let's go")
// checking the js link

var userSearch = {
  lat: ' ',
  lng: ' '
}

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

var address = $("#bike-search").val().trim();
$.ajax({
  url: "https://maps.googleapis.com/maps/api/geocode/json?address=" + address + "&key=AIzaSyBG8dPTg52rH0rTtwIR6a-Bl1DWiELwY1M",
  method: 'GET'
}).then(function(response){
    userSearch.lat = response.results[0].geometry.location.lat;
    userSearch.lng = response.results[0].geometry.location.lng;
  console.log(userSearch);
  reInitMap();
  })
}

function reInitMap() {
  var searchArea = userSearch;
  var map = new google.maps.Map(document.querySelector(".search-field"), {
    zoom: 18,
    center: searchArea
  });
  var marker = new google.maps.Marker({
    position: searchArea,
    map: map
  });}

function initMap() {
  var uluru = {lat:42.0166702, lng: 23.1000004};
  var map = new google.maps.Map(document.querySelector(".search-field"), {

    zoom: 18,
    center: uluru
  });
  var marker = new google.maps.Marker({
    position: uluru,
    map: map
  });
}

$("#search").on("click", locationSearch);

$(function () {
    var $bikes = $('#bikes');

    $.ajax({
        type: 'GET',
        url: 'https://sheltered-reaches-71424.herokuapp.com/api/v3/search?page=1&per_page=25&location=IP&distance=10&stolenness=stolen',
        dataType: 'json',
        cache: false,
        success: function (data) {
            $(data.bikes).each(function (index, value) {
                console.log(value);
            });
        }
    });
});
