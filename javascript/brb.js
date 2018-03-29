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

var database = firebase.database();
var userSearch = {
  lat: '',
  lng: ''
}
var bQuery1 = '';
var bQuery2 = '';
var GoogleAuth;
var userEmail;
var userImage;
var userId;
var userName;
var userImageObjects;
var SCOPE = 'https://www.googleapis.com/auth/drive.metadata.readonly';



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

    $('#sign-in-or-out-button').click(function() {
      handleAuthClick();
    }); 
    $('#revoke-access-button').click(function() {
      revokeAccess();
    }); 
  });
}

function handleAuthClick() {
  if (GoogleAuth.isSignedIn.get()) {
    // User is authorized and has clicked 'Sign out' button.
    $('.image-area').css('display', 'none');
    $('.user-name').css('display', 'none');
     $('.user-email').css('display', 'none');
    GoogleAuth.signOut();
  } else {
    // User is not signed in. Start Google auth flow.
    GoogleAuth.signIn();
  }
}

function revokeAccess() {
  GoogleAuth.disconnect();
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
    console.log(userImage);
    console.log(userEmail);
    console.log(userId);
    console.log(userName);




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

  
// Map Search Function

function locationSearch(event) {
event.preventDefault();


console.log("working");
var address = $("#bike-search").val().trim();
$.ajax({
  url: "https://maps.googleapis.com/maps/api/geocode/json?address=" + address + "&key=AIzaSyBG8dPTg52rH0rTtwIR6a-Bl1DWiELwY1M",
  method: 'GET',
}).done(function(response){
  userSearch.lat = response.results[0].geometry.location.lat;
  userSearch.lng = response.results[0].geometry.location.lng;
// console.log(userSearch);
reInitMap();
console.log(userSearch);
  bQuery1 = userSearch.lat;
  bQuery2 = userSearch.lng;
  console.log(bQuery1);
});

$.ajax({
  type: 'GET',
  url: 'https://sheltered-reaches-71424.herokuapp.com/api/v3/search?page=1&per_page=25&location=' + bQuery1 + ',-' + bQuery2 + '&distance=10&stolenness=proximity',     
  dataType: 'json',
  cache: false,
}).done(function (data) {
      console.log(data);
      console.log(bQuery1);

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
    zoom: 2,
    center: uluru
    // mapTypeControlOptions: {
    //   mapTypeIds: ['roadmap', 'satellite', 'hybrid', 'terrain',
    //           'styled_map']
    // }
    
  });
  var marker = new google.maps.Marker({
    position: uluru,
    map: map
  });
}

$("#addBike").on("click", function(event){
  event.preventDefault();

  var serial = $("#serial").val().trim();
  var manufacturer = $("#manufacturer").val().trim();
  var color = $("#color").val().trim();
  var email = $("#email").val().trim();
  var frame = $("#frame").val().trim();
  var imgurl = $("#image").val().trim();

database.ref().push({
  serial : serial,
  manufacturer: manufacturer,
  color: color,
  email: email,
  frame: frame,
  imgurl: imgurl
}) 

$("#serial").val(" ");
$("#manufacturer").val(" ");
$("#color").val(" ");
$("#email").val(" ");
$("#frame").val(" ");
$("#image").val(" ");
$(".addmsg").text("Bike added!");
})

$("#search").on("click", locationSearch);
$("#bike-cross").on("click", function(){
  $(".addBike").css("visibility", "visible");
})
$("#addClose").on("click", function(event){
event.preventDefault();
$(".addBike").css("visibility", "hidden");

})


//bike index functions



 //});
//});


//var bikeZip = Object.values(userSearch[0, + 1])
