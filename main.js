const size = "150";
// API KEY 
var key = 'f5a76bcde0f4fed7682b28cd60f2f9b1';
//...... Date function.................................
// Function sets the dates for the each day receiving as input
// how many days we need to increase. 

function addDays(days) {
  const dayArray = ["Sun", "Mon", "Tue", "Wed", "Thur", "Fri", "Sat"];
  const monthArray = ["Jan", "Feb", "Mar", "May", "Jun", "July", "Aug", "Sep", "Oct", "Nov", "Dec"];

  function amPm(hour) {
    if (hour > 12) { return "PM"; }
    else return "AM";
  }

  const currentDate = new Date();

  const hour = hoursIn12(currentDate.getHours());
  const minute = currentDate.getMinutes();
  const day = currentDate.getDay();
  const month = currentDate.getMonth();
  const year = currentDate.getFullYear();

  const result = hour + ":" + minute + " " + amPm(currentDate.getHours()) + " " + dayArray[day] + " " + monthArray[month] + " " + year;

  return result;
}

// Turn Hours into 12 hour format
console.log(addDays(1));

function hoursIn12(hours) {
  const hour12 = ((hours + 11) % 12 + 1);
  return hour12;
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

function convertWindDir(deg) {
  let compass = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW", "N"]
  let index = Math.round((deg % 360) / 22.5)
  return compass[index]
}
///............. Main divs in page....................

//make sure its right div in array
const todaydiv = document.getElementById("today");//Div with todays weather

console.log(todaydiv);

///.........................................................
function currentLocation(){
  function success(position) {
    const latitude  = position.coords.latitude;
    const longitude = position.coords.longitude;
    console.log(latitude, longitude);
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

//.............................................................................
async function weatherID(cityID, pos = 0) {
  //Fetch to get the weather data by altitude and longitude
  
  fetch("https://api.openweathermap.org/data/2.5/group?id="+cityID+"&appid="+key) 

    .then(function (resp) { return resp.json() }) // Convert data to json
    .then(function (data) {
      console.log(data);
      ///...................Today Main div.........
      //Sets date for today
      applyToHtml(data);
    })
    .catch(function () {
      
    });
}

//.............................................................................
async function weatherlocation(myLat,myLong, pos = 0) {
  //Fetch to get the weather data by altitude and longitude
  
  fetch("https://api.openweathermap.org/data/2.5/weather?lat="+myLat+"&lon="+ myLong+ "&appid=" + key) 

    .then(function (resp) { return resp.json() }) // Convert data to json
    .then(function (data) {
      console.log(data);
      ///...................Today Main div.........
      //Sets date for today
      applyToHtml(data);
    })
    .catch(function () {
      
    });
}

//.........................................................................
async function weatherZip(myZip, pos = 0) {
// Fetch the weather data using a zipcode
  
  fetch('https://api.openweathermap.org/data/2.5/weather?zip=' + myZip + '&appid=' + key)

    .then(function (resp) { return resp.json() }) // Convert data to json
    .then(function (data) {
      console.log(data);
      applyToHtml(data);
      ///...................Today Main div.........
    })
    .catch(function () {
      // catch any errors
      //If the zipcode function fails we try the current location aproach
      
    });
}

function applyToHtml(data){
  const temp = fahrenheit(data.main.temp) + "F°/" + celcius(data.main.temp) + "C°";
      const lowTemp = fahrenheit(data.main.temp_min) + "F°/" + celcius(data.main.temp_min) + "C°";
      const highTemp = fahrenheit(data.main.temp_max) + "F°/" + celcius(data.main.temp_max) + "C°"
      const feelsLike = fahrenheit(data.main.feels_like) + "F°/" + celcius(data.main.feels_like) + "C°"
      const sunRise = new Date(data.sys.sunrise * 1000);
      const sunSet = new Date(data.sys.sunset * 1000);
      const visibility = data.visibility + "-ft";

      const humidity = data.main.humidity;
      const wind = data.wind.speed + " MPH " + convertWindDir(data.wind.deg); // convert to KM
      const myIcon = data.weather[0].icon;
      //........................Today's Weather........................
      document.getElementById("Date").innerHTML = addDays(0);

      document.getElementById("Description").innerHTML = data.weather[0].description;
      document.getElementById("Location").innerHTML = data.name;
      document.getElementById("Temp").innerHTML = temp;

      //...........................Bottom Icons.................................
      document.getElementById("lowTemp").innerHTML = lowTemp;
      document.getElementById("highTemp").innerHTML = highTemp;
      document.getElementById("wind").innerHTML = wind;
      //document.getElementById("local");
      document.getElementById("humidity").innerHTML = humidity + " %";
      document.getElementById("feelsLike").innerHTML = feelsLike;
      document.getElementById("visibility").innerHTML = visibility;


      document.getElementById("sunRise").innerHTML = hoursIn12(sunRise.getHours()) + ":" + sunRise.getHours() + " AM";
      document.getElementById("sunSet").innerHTML = hoursIn12(sunSet.getHours()) + ":" + sunSet.getMinutes() + " PM";
      //..........................Weather Icon..................................
      const imgsun = document.getElementById("wicon");
      imgsun.src = "http://openweathermap.org/img/w/" + myIcon + ".png";
      imgsun.width = size;
      imgsun.height = size;

      // Adding information to the history array
      const cityname = data.name;
  
      locationHistory[cityname]={
        "longitude":data.coord.lon,
        "latitude":data.coord.lat,
        "country":data.sys.country
      };
      console.log(locationHistory);

}

// .........................TEST........................................
//Default area is Los Angeles CA 
//const defaultZip = navigator.geolocation.pos
weatherZip(90005);

//Checks the Zip code when button is clicked
function checkZipLength() {
  var zip = document.getElementById("myInput").value;
  if (zip.length >= 5) {
    weatherZip(zip);
  }
  console.log(zip);
}

//.....................................................................

//.......................................................................
const listOfZips = {}
//sessionStorage.setItem("myLocation", my)


function myFunction() {
  document.getElementById("myDropdown").classList.toggle("show");
}
function filterFunction() {
  var input, filter, ul, li, a, i;
  input = document.getElementById("myInput");
  filter = input.value.toUpperCase();
  div = document.getElementById("myDropdown");
  a = div.getElementsByTagName("a");
  for (i = 0; i < a.length; i++) {
    txtValue = a[i].textContent || a[i].innerText;
    if (txtValue.toUpperCase().indexOf(filter) > -1) {
      a[i].style.display = "";
    } else {
      a[i].style.display = "none";
    }
  }
}

