
window.addEventListener('load', () => {

    //Define variables
    let ring = document.querySelector('.ring');
    let long;
    let lat;
	let panel = document.querySelector(".panel");
    let temperatureDescription = document.querySelector(".temperature-description");
    let temperatureDegree = document.querySelector(".temperature-degree");
    let locationTimeZone = document.querySelector(".location-timezone");
    let temperatureSection = document.querySelector(".temperature-section");
    let temperatureSpan = document.querySelector(".temperature-section span");
	
    // Maps to translate API calls into the corresponding icons used by Skycons library
    let iconMap = new Map();
    iconMap.set('01d', 'CLEAR_DAY');
    iconMap.set('01n', 'CLEAR_NIGHT');
    iconMap.set('02d', 'PARTLY_CLOUDY_DAYS');
    iconMap.set('02n', 'PARTLY_CLOUDY_NIGHT');
    iconMap.set('03d', 'CLOUDY');
    iconMap.set('03n', 'CLOUDY');
    iconMap.set('09d', 'RAIN');
    iconMap.set('09n', 'RAIN');
    iconMap.set('10d', 'RAIN');
    iconMap.set('10n', 'RAIN');
    iconMap.set('11d', 'RAIN');
    iconMap.set('11n', 'RAIN');
    iconMap.set('13d', 'SNOW');
    iconMap.set('13n', 'SNOW');
    iconMap.set('50d', 'FOG');
    iconMap.set('50n', 'FOG');

    let backgroundMap = new Map();
    backgroundMap.set('01d', "url('./img/clear_day.png')");
    backgroundMap.set('01n', "url('./img/clear_night.jpg')");
    backgroundMap.set('02d', "url('./img/cloudy.jpg')");
    backgroundMap.set('02n', "url('./img/cloudy.jpg')");
    backgroundMap.set('03d', "url('./img/cloudy.jpg')");
    backgroundMap.set('03n', "url('./img/cloudy.jpg')");
    backgroundMap.set('50d', "url('./img/mist_day.jpg')");
    backgroundMap.set('50n', "url('./img/mist_night.jpg')");

    if(navigator.geolocation) 
    {
        navigator.geolocation.getCurrentPosition(position =>{
            long = position.coords.longitude;
            lat = position.coords.latitude;
            //Show panel
            const proxy = `https://corsanywhere.herokuapp.com/`;
            const api = `${proxy}api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&units=imperial&appid=69b294482b761218267bbdef9d82e278`;
            
            fetch(api)
            .then(response =>{
                return response.json();
            })
            .then(data => {
                console.log(data);
                const {temp, feels_like, humidity, pressure } = data.main
                const name = data.name
                const summary = data.weather
                const icon = summary[0].icon;
                const tempCelsius = (temp - 32) * .5556;
                console.log(temp);
                temperatureDegree.textContent = Math.round(temp);
                temperatureDescription.textContent = summary[0].description;
                locationTimeZone.textContent = name;
                
                // invoke setIcon function
                setIcon(icon, document.querySelector('.icon'));

                //change temperature unit by clicking on the current temperature
                temperatureSection.addEventListener('click', () => {
                    if(temperatureSpan.textContent === "F°") {
                        temperatureSpan.textContent = "C°";
                        temperatureDegree.textContent = Math.round(tempCelsius);
                    }
                    else {
                        temperatureSpan.textContent = "F°";
                        temperatureDegree.textContent = Math.round(temp);
                    }
                });
                document.body.style.background = backgroundMap.get(icon);
                document.body.style.backgroundSize = "cover";
                document.body.style.backgroundPosition = "center center";
                document.body.style.backgroundAttachment = "fixed";

                sleep(3000).then(() => { 
                    //ring.style.display = 'none';
                    $( ".cover" ).fadeOut( "slow", function() {
                        panel.style.display = "grid";
                      });
                    });
            })



        },
        function(error)   
        { 
            if (error.code == error.PERMISSION_DENIED) 
            {	
            //Hide panel until we are not sure that locations are allowed
            panel.style.display = "none";        
            alert("[WheaterApp] Please allow locations!");    
            }    
        });   
     }

    /** @brief Sets the weather icon
     *
     *  Using skycons.js the program creates an svg icon
     *  that corresponds to the current weather provided by
     *  the API.
     *
     *  @param icon API provided icon name. Link: https://openweathermap.org/weather-conditions
     *  @param iconID canvas icon element found in the index.html
     *  @return Void.
     */
    function setIcon(icon, iconID) 
    {
        //Create skycons object
        const skycons = new Skycons({color: "black"});
        //Convert icon name into skycons variable format
        const currentIcon = iconMap.get(icon);
        //Set icon
        skycons.set(iconID, Skycons[currentIcon]);
        //Play icon
        skycons.play();
        return;
    }
});

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }