
//hides buttons to add stuff until you auth in
$('.bike-add').css('display', 'none');
$('.stolen-bike-add').css('display', 'none');



// Initialize Firebase
var config = {
  apiKey: "AIzaSyD5zoy2pxMHA6PO97Yr_PEn8h2q_0VJ8_M",
  authDomain: "bikerightback-5cac5.firebaseapp.com",
  databaseURL: "https://bikerightback-5cac5.firebaseio.com",
  projectId: "bikerightback-5cac5",
  storageBucket: "",
  messagingSenderId: "1000343091978"
};
firebase.initializeApp(config);

// Home Made Global Variables
var database = firebase.database();
var userSearch = {
  lat: '',
  lng: ''
}

// stolen bike search variables
var bikePlace = [];
var bikeTime = [];
var stolenCoords = [];
var StolenBikeChosen;


// Google Auth variables
var GoogleAuth;
var userEmail;
var userImage;
var userId;
var userName;
var userImageObjects;
var SCOPE = 'https://www.googleapis.com/auth/drive.metadata.readonly';

// GOOGLE OAUTH



function handleClientLoad() {
  // Load the API's client and auth2 modules.
  // Call the initClient function after the modules load.
  gapi.load('client:auth2', initClient);
}

function initClient() {
  // Retrieve the discovery document for version 3 of Google Drive API.
  // In practice, your app can retrieve one or more discovery documents.
  var discoveryUrl = 'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest';

  // Initialize the gapi.client object, which app uses to make API requests.
  // Get API key and client ID from API Console.
  // 'scope' field specifies space-delimited list of access scopes.
  gapi.client.init({
    'apiKey': 'AIzaSyByFOJUGmmTwEAXH7i90m6Kir2e6ZfssGY',
    'discoveryDocs': [discoveryUrl],
    'clientId': '124313717233-ml667i7s5bkdeoknfnqd3lvbim0s703d.apps.googleusercontent.com',
    'scope': SCOPE
  }).then(function () {
    GoogleAuth = gapi.auth2.getAuthInstance();

    // Listen for sign-in state changes.
    GoogleAuth.isSignedIn.listen(updateSigninStatus);

    // Handle initial sign-in state. (Determine if user is already signed in.)
    var user = GoogleAuth.currentUser.get();
    setSigninStatus();

    $('#sign-in-or-out-button').click(function () {
      handleAuthClick();
    });

  });
}

function handleAuthClick() {
  if (GoogleAuth.isSignedIn.get()) {
    // User is authorized and has clicked 'Sign out' button.
    $('.image-area').css('display', 'none');
    $('.user-name').css('display', 'none');
    $('.user-email').css('display', 'none');
    $('.bike-add').css('display', 'none');
    $('.stolen-bike-add').css('display', 'none');

    GoogleAuth.signOut();
  } else {
    // User is not signed in. Start Google auth flow.
    GoogleAuth.signIn();
  }
}



function setSigninStatus(isSignedIn) {
  var user = GoogleAuth.currentUser.get();
  var isAuthorized = user.hasGrantedScopes(SCOPE);
  if (isAuthorized) {
    //Gets user info and stores in vars, also adds the user profile image/info to the page
    var userProf = user.getBasicProfile();
    userEmail = userProf.getEmail();
    userImage = userProf.getImageUrl();
    userId = userProf.getId();
    userName = userProf.getName();
    userImageObject = $("<img>").attr("src", userImage);
    $('.image-area').css('display', 'block');
    $('.user-name').css('display', 'block');
    $('.user-email').css('display', 'block');
    $(".user-name").html('Username: ' + userName);
    $(".user-email").html('User Email: ' + userEmail);
    $(".image-area").html(userImageObject);
    $('.bike-add').css('display', 'inline');
    $('.stolen-bike-add').css('display', 'inline');

    $('#sign-in-or-out-button').html('Sign out');
    $('#revoke-access-button').css('display', 'inline-block');
    // $('#auth-status').html('You are currently signed in and have granted ' +
    //     'access to this app.');
  } else {
    $('#sign-in-or-out-button').html('Sign In/Authorize');
    $('#revoke-access-button').css('display', 'none');
    // $('#auth-status').html('You have not authorized this app or you are ' +
    //     'signed out.');
  }
}

function updateSigninStatus(isSignedIn) {
  setSigninStatus();
}
//END GOOGLE OAUTH

//Function that initializes map on document load
function initMap() {
  var uluru = { lat: 42.0166702, lng: 23.1000004 };
  var map = new google.maps.Map(document.querySelector(".search-field"), {
    zoom: 4,
    center: uluru
  });
  var marker = new google.maps.Marker({
    position: uluru,
    map: map
  });
}


// Map Search Function
function locationSearch(event) {
  event.preventDefault();

  console.log("working");
  var address = $("#bike-search").val().trim();
  $.ajax({
    url: "https://maps.googleapis.com/maps/api/geocode/json?address=" + address + "&key=AIzaSyBG8dPTg52rH0rTtwIR6a-Bl1DWiELwY1M",
    method: 'GET',
  }).done(function (response) {
    userSearch.lat = response.results[0].geometry.location.lat;
    userSearch.lng = response.results[0].geometry.location.lng;
    reInitMap();

    $.ajax({
      type: 'GET',
      url: 'https://sheltered-reaches-71424.herokuapp.com/api/v3/search?page=1&per_page=25&location=' + userSearch.lat + ',' + userSearch.lng + '&distance=10&stolenness=proximity',
      dataType: 'json',
      cache: false,
    }).done(function (data) {
      for (i = 0; i < data.bikes.length; i++) {
        var place = data.bikes[i].stolen_location;
        var time = data.bikes[i].date_stolen;
        bikePlace.push(place);
        bikeTime.push(time);
      }
      stolenMarkers();
    })
  });


  $("#bike-search").val(" ");
}

//Function that returns latitude and longitude for items in bikePlace array

function stolenMarkers() {
  var stolenBikeLocationRequests = [];
  for (i = 0; i < bikePlace.length; i++) {
    if (!bikePlace[i]) {

    }
    else {
      var location = bikePlace[i];
      console.log(location);
      var stolenBikeLocation = $.ajax({
        url: "https://maps.googleapis.com/maps/api/geocode/json?address=" + location + "&key=AIzaSyBG8dPTg52rH0rTtwIR6a-Bl1DWiELwY1M",
        method: 'GET',
      }).done(function (response) {
        var stolenLatLng = {
          lat: response.results[0].geometry.location.lat,
          lng: response.results[0].geometry.location.lng
        }


        stolenCoords.push(stolenLatLng);
      });

      stolenBikeLocationRequests.push(stolenBikeLocation);
    }
  }

  Promise.all(stolenBikeLocationRequests)
    .then(function () {
      reInitMap();
    })
  console.log(stolenCoords);
}

// Function that moves the map's centered point
function reInitMap() {
  var searchArea = userSearch;
  var map = new google.maps.Map(document.querySelector(".search-field"), {
    zoom: 10,
    center: searchArea
  });
  for (i = 0; i < stolenCoords.length; i++) {
    var marker = new google.maps.Marker({
      position: stolenCoords[i],
      map: map
    });
  }
}

// Add Bike to Firebase Function
$("#addBike").on("click", function (event) {
  event.preventDefault();

  if (!userId) {
    $(".addmsg").text("You must sign in with Google");
  }
  else {
    var userId2 = userId.trim();
    var serial = $("#serial").val().trim();
    var manufacturer = $("#manufacturer").val().trim();
    var color = $("#color").val().trim();
    var email = $("#email").val().trim();
    var frame = $("#frame").val().trim();
    var imgurl = $("#image").val().trim();

    var usersRef = database.ref().child("users");

    usersRef.child(userId2).push({
      serial: serial,
      manufacturer: manufacturer,
      color: color,
      email: email,
      frame: frame,
      imgurl: imgurl,
    });
  }

  $("#serial").val(" ");
  $("#manufacturer").val(" ");
  $("#color").val(" ");
  $("#email").val(" ");
  $("#frame").val(" ");
  $("#image").val(" ");
  $(".addmsg").text("Bike added!");
})

$("#search").on("click", locationSearch);
$("#bike-cross").on("click", function () {
  $(".addBike").css("visibility", "visible");
})
$("#addClose").on("click", function (event) {
  event.preventDefault();
  $(".addBike").css("visibility", "hidden");

})

// Report Bike Stolen Functions: let user choose which bike was stolen
$("#bike-bandit").on("click", function () {
  $(".stolenBike").css("visibility", "visible");
  var usersRef = database.ref().child("users").child(userId);
  usersRef.on("value", function (childSnapshot) {
    console.log("bike report function testing");
    for (let i = 0; i < childSnapshot.length; i++) {


      var image = childSnapshot.val().imgurl;
      var bikeID = childSnapshot.val()
      console.log(image);
      console.log(bikeID);

      var p = $("<img>").src(image).class("stolen-bike-pictures").attr("data", bikeID);

      $(".bikeChoice").prepend(p);

    }
    $('.stolen-bike-pictures').click(function () {

      StolenBikeChosen = $(this).attr("data").val();

    })
  })

// Patch stolen status to database
  $('#addStolenBike').click(function () {
    event.preventDefault();

    if (!userId) {
      $(".addmsg").text("You must sign in with Google");
    }
    else {
      var userId2 = userId.trim();
      var date = $("#date").val().trim();
      var location = $("#location").val().trim();
      var time = $("#time").val();
      var comments = $("#comments").val().trim();
      $("#date").val(" ");
      $("#location").val(" ");
      $("#comments").val(" ");
      var usersRef = database.ref().child("users").child(userId2);

      //goes to the database, grab the unique universal ID for the pushes and save 
      //to a var that will be passed into the image class, and find the picture they put of the bike
      //go into each object and create an image URL
      // When th
      usersRef.child(StolenBikeChosen).patch({
        stolen: "stolen",
        date: date,
        location: location,
        time: time,
        comments: comments,
      });
    }
      $(".addmsg").text("Bike added!");
    })
  });



  $("#addStolenClose").on("click", function (event) {
    event.preventDefault();
    $(".stolenBike").css("visibility", "hidden");

  })

  $("#addStolenBike").on("click", function (event) {
    event.preventDefault();
    $(".stolenBike").css("visibility", "hidden");


  });

