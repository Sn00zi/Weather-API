// Get references to the #btn and input element
var btn = document.querySelector("#btn-search");
// get the reference to the div for the historic cities
var containerHistoricCities = document.querySelector("#historic-Cities");
// get the reference to the div for the Current cities
var containerCurrent = document.querySelector("#targetCity");
// get the reference to the div for the forecast cities
var containerForecast = document.querySelector("#infoCity");

//Array of Objects for localStores data
var dataStore = JSON.parse(localStorage.getItem('cities')) || [];

var urlIcon;
    if (location.protocol === 'http:') {
        urlIcon = 'http://openweathermap.org/img/wn/';
     } else {
        urlIcon = 'https://openweathermap.org/img/wn/';
     }

// look for UV index by latitude and longitude coordinates

// Objetc for Weather conditions for a city
var weatherCondition = [];


/* Load the fisrt time when the page load  */
function start() {

    // load the localStore
    loadCity();

}

// function to retreive the information from localStore
var loadCity = function(){

   
    /*  Acceptance Criteria #1.2                                       */
    /*  WHEN I search for a city                                       */
    /*  THEN that city is added to the search history                  */
  
    cleaningElement(containerHistoricCities);

        if(dataStore){
            // creating a unordered list to store the info
            var ulElement = document.createElement("ul");
            ulElement.classList.add("list-unstyled");
            ulElement.classList.add("w-100");
            
            //for loop to iterate through out the localStore
            for(var i = 0; i < dataStore.length; i++){
                
                var liElement = document.createElement("li");
                // append a button with bootstraps classes inside each item
                liElement.innerHTML = "<button type='button' class='list-group-item list-group-item-action' attr='"+dataStore[i]+"'>" + dataStore[i] + "</button>";
                // append the item into its container
                ulElement.appendChild(liElement);
                }

                containerHistoricCities.appendChild(ulElement); 
            }
};

//listener or call function when is clicked on button on each city history using Jquery

$(document).on("click", ".list-group-item", function(event) {

    event.preventDefault();

 
    /*  Acceptance Criteria #5                                         */
    /*  WHEN I click on a city in the search history                   */
    /*  THEN I am again presented with current and future conditions   */
    /*  for that city                                                  */
   

    //getting the attribute that contain the name of the city
    var city = $(this).attr("attr");
    callApiFetch(city);
});

// function to clean everything is inside the container
var cleaningElement = function(element){
    element.innerHTML = "";
};

//converting °F to °C
var converTemp = function(temp){
    return (Math.floor((parseFloat(temp) -32) * (5/9))).toString();
};

//converting Wind Speed form MPH to KHP
var convertWSpeed = function(speed){
    return (Math.floor(parseFloat(speed) * 1.609)).toString();
};

//function to determine how much intensity is UV Index
var findUV = function(uv){

    /*  Acceptance Criteria #3                                         */
    /*  WHEN I view the UV index                                       */
    /*  THEN I am presented with a color that indicates whether the    */
    /*  conditions are favorable, moderate, or severe                  */
   
    var indexUV = parseFloat(uv);
    var bgColor;                            
    
    if(indexUV < 3){
        bgColor = "bg-success";             
    }
    else if( indexUV < 6){
            bgColor = "bg-warning";         
        }
        else if(indexUV < 8){
                bgColor = "bg-danger";      
            }
            else {
                    bgColor = "bg-dark";   
            }
    return bgColor;
};

// showing the information about the weather stored in the array of object weatherCondition
var weatherHTML = function (city, uv) {


    /*  Acceptance Criteria #1.1                                       */
    /*  WHEN I search for a city                                       */
    /*  THEN I am presented with current and future conditions for     */
    /*  that city                                                      */
      

    
    /*  Acceptance Criteria #2                                         */
    /*  WHEN I view current weather conditions for that city           */
    /*  THEN I am presented with the city name, the date, an icon      */
    /*  representation of weather conditions, the temperature, the     */
    /*  humidity, the wind speed, and the UV index                     */
   

    //cleaning  the containers 
    cleaningElement(containerCurrent);
    cleaningElement(containerForecast); 

    //Current City 
    var ctn1 = document.createElement("div");                          
    ctn1.classList.add("col-6");                                       
    var ctn2 = document.createElement("div");                          
    ctn2.classList.add("col-6");                                      

    var cityEl = document.createElement("h2");
    var imageCurrent = document.createElement("img");

    cityEl.textContent = city + " (" + weatherCondition[0].dateT +")";
    imageCurrent.setAttribute("src", weatherCondition[0].icon);
    //imageCurrent.classList.add("border");                            
    imageCurrent.classList.add("bg-info");                             
    ctn1.appendChild(cityEl);
    ctn2.appendChild(imageCurrent);
    var ctn3  = document.createElement("div");                         
    ctn3.classList.add("col-12");                       
    ctn3.innerHTML =    "<p>Temperature: " + weatherCondition[0].temp + " °F / " + converTemp(weatherCondition[0].temp) + " °C</p>" + 
                        "<p>Humidity: " + weatherCondition[0].humidity + "% </p>" +
                        "<p>Wind Speed: " + weatherCondition[0].speed + " MPH / " + convertWSpeed(weatherCondition[0].speed) + " KPH </p>" +
                        "<p>UV index: <span class='text-white "+ findUV(uv) + "'>" + uv + "</span></p>";
    containerCurrent.appendChild(ctn1);
    containerCurrent.appendChild(ctn2);
    containerCurrent.appendChild(ctn3);

    // 5 days forecast

    
    /*  Acceptance Criteria #4                                         */
    /*  WHEN I view future weather conditions for that city            */
    /*  THEN I am presented with a 5-day forecast that displays        */
    /*  the date, an icon representation of weather conditions,        */
    /*  the temperature, and the humidity                              */
    
    var ctn6 = document.createElement("div");        
    ctn6.classList.add("row");                        
    var ctn7 = document.createElement("div");         
    ctn7.classList.add("col-12");                     
    ctn7.innerHTML = "<h2>5-Day Forecast</h2>";
    ctn6.appendChild(ctn7);
    containerForecast.appendChild(ctn6);

    var ctn8 = document.createElement("div");         
    ctn8.classList.add("d-flex");                     


    // for loop to get the information about the weather stored in the array weatherCondition
    for(var i=1; i<weatherCondition.length; i++){    
        
        var ctn4  = document.createElement("div");      
        //ctn4.classList.add("col-2");                    
        ctn4.classList.add("card");                     
        ctn4.classList.add("bg-primary");               
        ctn4.classList.add("text-white");              
        ctn4.classList.add("rounded");                  
        ctn4.classList.add("mr-2");                    
        ctn4.classList.add("flex-fill")
        var ctn5  = document.createElement("div");      
        ctn5.classList.add("card-body");
        //ctn5.classList.add("flex-fill");
        var title = document.createElement("h6");
        title.classList.add("card-title");
        var imageForecast = document.createElement("img");
        title.textContent = weatherCondition[i].dateT;
        imageForecast.setAttribute("src", weatherCondition[i].icon);
        var pEl1 = document.createElement("p");
        var pEl2 = document.createElement("p");
        pEl1.classList.add("small");
        pEl1.textContent =   "Temperature: " + weatherCondition[i].temp + " °F";
        pEl2.classList.add("small");
        pEl2.textContent =  "Humidity: " + weatherCondition[i].humidity + "%";
        ctn5.appendChild(title);
        ctn5.appendChild(imageForecast);
        ctn5.appendChild(pEl1);
        ctn5.appendChild(pEl2)
        ctn4.appendChild(ctn5);        
        ctn8.appendChild(ctn4);
    }
    containerForecast.appendChild(ctn8);
    
};

// Store the city in localStore
var saveCity = function(city){

    var flag = false
    if(dataStore){
        for(var i = 0; i < dataStore.length; i++){
            if(dataStore[i] === city){
                flag = true;
            }
        }
        if(flag){
            displayAlertMessage("The City: "+city+" already exists")
            //return
        }
    }
    if(!flag){
        dataStore.push(city);
        localStorage.setItem("cities",JSON.stringify(dataStore));
    }
    
    loadCity();
}
var searchForDate9AM = function (str) {
    var hour = str.split(" ")[1].split(":")[0];
    var flag = false;
    
    if(hour === "09"){
        flag = true;
    }        
    
    return flag;
};

// formating the date that object response provide from the format "YYYY-MM-DD HH:MM:SS" to "MM/DD/YYYY"
var formatDate = function(strDate){

    var newDate = strDate.split(" ")[0].split("-");

    return (newDate[1]+"/"+newDate[2]+"/"+newDate[0]);
};

//function to create the array of object to store the weather information 
var createDataObject = function(list, position){

    // empty the array
    if(weatherCondition.length)
        weatherCondition = [];

    // the first data from the object is the current Weather information 
    var obj = {
        dateT : formatDate(list[0].dt_txt),
        humidity : list[0].main.humidity,
        speed: list[0].wind.speed,
        temp: list[0].main.temp,
        icon : urlIcon + list[0].weather[0].icon + ".png",
        lat : position.lat,
        lon: position.lon
    };

    weatherCondition.push(obj);

    for(var i=1; i<list.length; i++){
        // I decided to select the information of the following days when the time it would be 9 am

        if(searchForDate9AM(list[i].dt_txt)){
            obj = {
                dateT : formatDate(list[i].dt_txt),
                humidity : list[i].main.humidity,
                speed: list[i].wind.speed,
                temp: list[i].main.temp,
                icon : urlIcon + list[i].weather[0].icon + ".png",
                lat : position.lat,
                lon: position.lon
            };
            weatherCondition.push(obj);
        }
    }

};

//Function to display all messages generate in the application
var displayAlertMessage = function(msg) {
    alert(msg);
};

// function to retrieve to information about the weather
var callApiFetch = function(city){

    var url;
    if (location.protocol === 'http:') {
        url = 'http://api.openweathermap.org/data/2.5/forecast?appid=b262298fbe39ad30d243f31f6e1297bc&units=imperial&q='+city;
     } else {
        url = 'https://api.openweathermap.org/data/2.5/forecast?appid=b262298fbe39ad30d243f31f6e1297bc&units=imperial&q='+city;
     }

    fetch(url)

    .then(function(weatherResponse) {
        return weatherResponse.json();
     })
    .then(function(weatherResponse) {

        if (weatherResponse.cod != "200") {
            
            displayAlertMessage("Unable to find "+ city +" in OpenWeathermap.org");

            return;
        } else {
                // sending te list array for the data about the forescast and the object 
                createDataObject(weatherResponse.list, weatherResponse.city.coord);
            }

            var url1;
        if (location.protocol === 'http:') {
            url1 = 'http://api.openweathermap.org/data/2.5/uvi?appid=b262298fbe39ad30d243f31f6e1297bc&lat='+weatherCondition[0].lat+'&lon='+weatherCondition[0].lon;
        } else {
            url1 = 'https://api.openweathermap.org/data/2.5/uvi?appid=b262298fbe39ad30d243f31f6e1297bc&lat='+weatherCondition[0].lat+'&lon='+weatherCondition[0].lon;
        }

        fetch(url1)

        .then(function(uvResponse) {
          return uvResponse.json();
        })
        .then(function(uvResponse) {

          if (!uvResponse) {   //verify the information
            displayAlertMessage('OpenWeathermap.org could not find anything for latitude and Longitude');

            return;
          } else {

            //store the city in localStore
            saveCity(city);

            // generation the HTML for weather
            weatherHTML(city, uvResponse.value);
          }
        })
    })
        .catch(function(error) {
            // if there is a problen to connect to OpenWeathermap.org
            displayAlertMessage("Unable to connect to OpenWeathermap.org");
            return;
          });
};

// function listener on click button
var search = function(event){
    event.preventDefault();

    //getting the value of the input
    var inputElement = document.querySelector("#searchCity");
    var textInput = inputElement.value.trim();

    if(inputElement.value === ""){
        alert("Weather Dashbord\n   You must enter a City");
        return;
    }
    // if the value is a string 
    else{
   
        callApiFetch(textInput);

    }

};

// function that start everything  
start();
// Add event listener to Searching button 
btn.addEventListener("click", search);
