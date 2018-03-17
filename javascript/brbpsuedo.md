# Bike Right Back Psuedocode

1. Document.ready function

2. Need to initialize and create database variable

3. Authentication function needs to be able to take user input (Jeff)
    a. Pull data (ajax) from bikeindex API 
    b. Pull data (ajax) from our Firebase
    c. Populate User Info Bar & Pass user home zipcode as default to zipcode form

4. Add Bike Button 
    a. Opens a window with inputs
    b. Inputs capture User Information and add it to their authentication in Firebase
    c. And passes their info to Bike Index (database.ref.set)
        User INFO must include: 
          I. Name
          II. Zipcode
          III. E-mail
          IV. Bike Frame Number
          V. Stolen: True or False
          VI. Picture of Bike

5. Zipcode Input Bar needs to capture values and then on submit: 
    a. Pass values into the GOOGLE API (ajax) 
    b. And the project database (database.ref.set)
    c. Populate .search-form with cards that display information from the database filtered via googlemaps (ajax)

6. Right hand column needs to populate entries from database from most recent to least recent

7. Stolen button on click
    a. opens window to input address
    b. changes user boolean from false to true

