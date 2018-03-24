console.log("let's go")
// checking the js link

var latitude;
var longitude;

// Initialize Firebase
var config = {
    apiKey: "AIzaSyBw74DNtaJAI7bfQW5VLX6BW7I14OmqAQ0",
    authDomain: "bike-right-back.firebaseapp.com",
    databaseURL: "https://bike-right-back.firebaseio.com",
    projectId: "bike-right-back",
    storageBucket: "bike-right-back.appspot.com",
    messagingSenderId: "124313717233"
};
firebase.initializeApp(config) 


<<<<<<< HEAD
console.log("working");
var address = $("#location-search").val().trim();
$.ajax({
  url: "https://maps.googleapis.com/maps/api/geocode/json?address=" + address + "&key=AIzaSyBG8dPTg52rH0rTtwIR6a-Bl1DWiELwY1M",
  method: 'GET'
}).then(function(response){
    latitude = response.results[0].geometry.location.lat;
    longitude = response.results[0].geometry.location.lng;
})
console.log(latitude);
console.log(longitude);
}
=======
>>>>>>> 6d00dae743d20869ec1c55b22f004eafd8f51ca8

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
