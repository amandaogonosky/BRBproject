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
