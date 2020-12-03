//Jhonatan Medina 
//Weather web app 1.0

// API KEY 
var key = 'f5a76bcde0f4fed7682b28cd60f2f9b1';
fromStorage();
// .........................RUN........................................
//Default area is Los Angeles CA 
//const defaultZip = navigator.geolocation.pos
weatherZip(90005);

//...... Date function.................................
// Function sets the dates for the each day receiving as input
// how many days we need to increase. 
//turns time into 12 hour format
function hoursIn12(hours) {
  const hour12 = ((hours + 11) % 12 + 1);
  return hour12;
}
//Gets current date
function addDays(days) {
  const dayArray = ["Sun", "Mon", "Tue", "Wed", "Thur", "Fri", "Sat"];
  const monthArray = ["Jan", "Feb", "Mar", "May", "Jun", "July", "Aug", "Sep", "Oct", "Nov", "Dec"];
  // decides weather it is morning or afternoon
  function amPm(hour) {
    if (hour > 12) { return "PM"; }
    else return "AM";
  }
  //Start date object
  const currentDate = new Date();
  //get hours
  const hour = hoursIn12(currentDate.getHours());
  //get minutes
  const minute = currentDate.getMinutes();
  //get day
  const day = currentDate.getDay();
  //get month
  const month = currentDate.getMonth();
  //get year
  const year = currentDate.getFullYear();
  //Current time and date
  const result = hour + ":" + minute + " " + amPm(currentDate.getHours()) + " " + dayArray[day] + " " + monthArray[month-1] + " " + year;
  return result;
}

// gets temperature in Farengeit
function fahrenheit(temp) {
  return Math.round(((parseFloat(temp) - 273.15) * 1.8) + 32)
}
// gets temperature in Celcius
function celcius(temp) {
  return Math.round(parseFloat(fahrenheit(temp) - 32) / (9 / 5));
}
//.............. direction..................................
//get the direction of the wind 
//I found the formula on a forumn
function convertWindDir(deg) {
  let compass = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW", "N"]
  let index = Math.round((deg % 360) / 22.5)
  return compass[index]
}
///............. Get Current location.............
function currentLocation(){
  function success(position) {
    //gets latitude
    const latitude  = position.coords.latitude;
    //gets longitude
    const longitude = position.coords.longitude;
    // get current position
    weatherlocation(latitude, longitude);
  }
  
  function error() {
    status.textContent = 'Unable to retrieve your location';
    weatherZip(90005);
  }
  
  if(!navigator.geolocation) {
    status.textContent = 'Geolocation is not supported by your browser';
  } else {
    status.textContent = 'Locating…';
    navigator.geolocation.getCurrentPosition(success, error);
  }
}
//.......................................................................
var locationHistory = {
  //Information will be added when program runs

};
//saves information to storage
function toStorage(myObject){
  localStorage.setItem("lastLocation",JSON.stringify(myObject));
}
// retrieves information from storage
function fromStorage(){
  try{
    const data = JSON.parse(localStorage.getItem("lastLocation"));
    console.log(data.name + " was your last location.");
    //apply information to html
    applyToHtml(data);
    const imgsun = document.getElementById("wicon");
    //Meme to inform there is no internet
    imgsun.src = "./images/noInternet.jpg";
    imgsun.width = size;
    imgsun.height = size;
  }
  catch(error){
    console.error("Items in memory are empty.");
  }
}
//Checks the Zip code when button is clicked
function checkZipLength() {
  var zip = document.getElementById("myInput").value;
  if (zip.length >= 5) {
    weatherZip(zip);
  }
}
// show the content of the drop down menu
function myFunction() {
  document.getElementById("myDropdown").classList.toggle("show");
} // for the contents of the menu
function filterFunction() {
  var input, filter, ul, li, a, i;
  input = document.getElementById("myInput");
  filter = input.value.toUpperCase();
  div = document.getElementById("myDropdown");
  a = div.getElementsByTagName("a");
}
//......................... functions to fetch the weather inforamtion....................................................
async function weatherlocation(myLat,myLong, pos = 0) {
  //Fetch to get the weather data by altitude and longitude
  
  fetch("https://api.openweathermap.org/data/2.5/weather?lat="+myLat+"&lon="+ myLong+ "&appid=" + key) 

    .then(function (resp) { return resp.json() }) // Convert data to json
    .then(function (data) {
      console.log(data);
      //Apply data to html
      applyToHtml(data);
    })
    .catch(function () {
      //incase it fails we will use the information from the storage
      console.log("Connection failed, weather for pevious location displayed.");
      fromStorage();
    });
}
//.........................................................................
async function weatherZip(myZip, pos = 0) {
// Fetch the weather data using a zipcode
  
  fetch('https://api.openweathermap.org/data/2.5/weather?zip=' + myZip + '&appid=' + key)

    .then(function (resp) { return resp.json() }) // Convert data to json
    .then(function (data) {
      //Apply data to the html 
      applyToHtml(data);
      ///...................Today Main div.........
    })
    .catch(function () {
      // catch any errors
      //Incase it fails we will use weather data fromstorage
      console.log("Connection failed, weather for pevious location displayed.");
      fromStorage();
    });
}
// Applies the date information to the html
function applyToHtml(data){
  toStorage(data);
  // TURN temp to farenheit
      const temp = fahrenheit(data.main.temp) + "F°/" + celcius(data.main.temp) + "C°";
      //days low temp
      const lowTemp = fahrenheit(data.main.temp_min) + "F°/" + celcius(data.main.temp_min) + "C°";
      //day's highest temperature
      const highTemp = fahrenheit(data.main.temp_max) + "F°/" + celcius(data.main.temp_max) + "C°"
      // what the weather really feels like
      const feelsLike = fahrenheit(data.main.feels_like) + "F°/" + celcius(data.main.feels_like) + "C°"
      //The time of the sunrise
      const sunRise = new Date(data.sys.sunrise * 1000);
      //the time of the suset
      const sunSet = new Date(data.sys.sunset * 1000);
      //the visability in meters
      const visibility = data.visibility + "-meters";
      //humidity 
      const humidity = data.main.humidity;
      //the spped of the wind
      const wind = data.wind.speed + " MPH " + convertWindDir(data.wind.deg); // convert to KM
      //The icon for the weather
      const myIcon = data.weather[0].icon;

      //Sets the weather data from the JSON file to the html using ids

      //........................Today's Weather........................
      //.......................The Main icon ...........................
      //sets the time and date
      document.getElementById("Date").innerHTML = addDays(0);
      //sets the description of the weather
      document.getElementById("Description").innerHTML = data.weather[0].description;
      //sets the name of the location for the weather
      document.getElementById("Location").innerHTML = data.name;
      //sets the temperature
      document.getElementById("Temp").innerHTML = temp;

      //...........................Bottom Icons.................................
      // sets the lowest temperature of the day
      document.getElementById("lowTemp").innerHTML = lowTemp;
      // sets the highest temperature of the day
      document.getElementById("highTemp").innerHTML = highTemp;
      //sets the speed of the wind
      document.getElementById("wind").innerHTML = wind;
      //sets the humidity percentage
      document.getElementById("humidity").innerHTML = humidity + " %";
      // sets the real feel of the weather
      document.getElementById("feelsLike").innerHTML = feelsLike;
      //sets the visibility of the weather
      document.getElementById("visibility").innerHTML = visibility;
      //sets the time of the sunrise
      document.getElementById("sunRise").innerHTML = hoursIn12(sunRise.getHours()) + ":" + sunRise.getHours() + " AM";
      //sets the time of the sunset
      document.getElementById("sunSet").innerHTML = hoursIn12(sunSet.getHours()) + ":" + sunSet.getMinutes() + " PM";
      //..........................Weather Icon..................................
      // sets the image for the weather icon from the url
      const imgsun = document.getElementById("wicon");
      imgsun.src = "http://openweathermap.org/img/w/" + myIcon + ".png";
      imgsun.width = "150";
      imgsun.height = "150";

      // Adding information to the history array
      const cityname = data.name;
  
      locationHistory[cityname]={
        "longitude":data.coord.lon,
        "latitude":data.coord.lat,
        "country":data.sys.country
      };
}

