const OPENWEATHERMAP_API = "2551e5bf5c65e8b78903fa8633975dc7"
const ABSTRACT_API = "e4fa7203c66f46c19e6d181aabf057f7"
const ipUrl = `https://ipgeolocation.abstractapi.com/v1/?api_key=${ABSTRACT_API}`

const weatherEmojis = {
    '01d':'☀️',
    '02d':'🌤️',
    '03d':'☁️',
    '04d':'⛅️',
    '09d':'🌧️',
    '10d':'🌦️',
    '11d':'⛈️',
    '13d':'❄️',
    '50d':'🌫️',
    '01n':'☀️',
    '02n':'🌤️',
    '03n':'☁️',
    '04n':'⛅️',
    '09n':'🌧️',
    '10n':'🌦️',
    '11n':'⛈️',
    '13n':'❄️',
    '50n':'🌫️',
}

const units = $('#convert-celsius').hasClass("disabled") ? 'metric' : 'imperial'
const tempUnit = units == 'imperial' ? ' °F' : ' °C'
const speedUnit = units == 'imperial' ? ' MPH' : ' m/s'

function getFlagEmoji(countryCode) {
    const codePoints = countryCode
      .toUpperCase()
      .split('')
      .map(char =>  127397 + char.charCodeAt())
    return String.fromCodePoint(...codePoints)
  }

async function fetchJsonData(url) {
    const response = await fetch(url)
    return response.json()
}

async function fetchGeoData(input) {
  const limit = 5
  const geoUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${input}&limit=${limit}&appid=${OPENWEATHERMAP_API}`
  const geoData = await fetchJsonData(geoUrl)
  return geoData[0]
}

async function fetchWeatherData(lat, lon) {
  const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${OPENWEATHERMAP_API}`
  const weatherData = await fetchJsonData(weatherUrl)
  return weatherData
}

function loadMap(lat, lon) {
  const map = L.map('map').setView([lat, lon], 13);

  Esri_NatGeoWorldMap = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer/tile/{z}/{y}/{x}', {
	attribution: 'Tiles &copy; Esri &mdash; National Geographic, Esri, DeLorme, NAVTEQ, UNEP-WCMC, USGS, NASA, ESA, METI, NRCAN, GEBCO, NOAA, iPC',
	maxZoom: 16}).addTo(map)
}

function updateMap(lat, lon) {
  const map = L.map('map')
  map = map.remove()
  map.flyTo([40.737, -73.923], 8)
  // Esri_NatGeoWorldMap = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer/tile/{z}/{y}/{x}', {
	// attribution: 'Tiles &copy; Esri &mdash; National Geographic, Esri, DeLorme, NAVTEQ, UNEP-WCMC, USGS, NASA, ESA, METI, NRCAN, GEBCO, NOAA, iPC',
	// maxZoom: 16}).addTo(map)
}

function displayWeather(response) {
  const tempCelsius = response.main.temp - 273.15
  const tempFahrenheit = tempCelsius * (9/5) + 32

  // display temp based on whether celsius or fahrenheit is selected
  const units = $('#convert-celsius').hasClass("disabled") ? 'metric' : 'imperial'
  const temp = units == 'metric' ? tempCelsius : tempFahrenheit
  const speed = units == 'metric' ? response.wind.speed : response.wind.speed * 2.23694
  const tempUnit = units == 'imperial' ? ' °F' : ' °C'
  const speedUnit = units == 'imperial' ? ' MPH' : ' m/s'

  const description = response.weather[0].main
  const iconCode = response.weather[0].icon
  const humidity = response.main.humidity
  const windSpeedMetric = response.wind.speed
  const windSpeedImperial = response.wind.speed * 2.23694
  
  //Add weather description
  $("#description").html(description)
  $("#weather-emoji").html(weatherEmojis[iconCode])

  //Remove 'N/A' and add temperature
  $("#current-temp").removeClass("wi wi-na")
  $("#current-temp").html(temp.toPrecision(3) + `${tempUnit}`)
  
  //Add humidity and wind speed
  $("#humidity").html(humidity + "%")
  $("#wind-speed").html(speed.toPrecision(3) + `${speedUnit}`)
  
  //Temperature-dependent background images
  if (tempFahrenheit > 70) {
    $("body").css({
      "background": "url(https://images.unsplash.com/uploads/1412231250505b65c703c/1fa14fb0?q=80&fm=jpg&s=66cc7c8abbf07117bd731f07b2fdc717) no-repeat center center fixed",
      "-webkit-background-size": "cover",
      "-moz-background-size": "cover",
      "-o-background-size": "cover",
      "background-size": "cover"
    })
  }
  if (tempFahrenheit <= 70 && tempFahrenheit > 50) {
    $("body").css({
      "background": "url(https://images.unsplash.com/uploads/14126758789351371c7ec/aa322c2d?q=80&fm=jpg&s=2b648d0828ab09b915215b1003a1b633) no-repeat center center fixed",
      "-webkit-background-size": "cover",
      "-moz-background-size": "cover",
      "-o-background-size": "cover",
      "background-size": "cover"
    })
  }
  if (tempFahrenheit <= 50 && tempFahrenheit > 32) {
    $("body").css({
      "background": "url(https://images.unsplash.com/reserve/IPEivX6xSBaiYOukY88V_DSC06462_tonemapped.jpg?q=80&fm=jpg&s=7be7c6e84b12651aa77de306dd21ff1e) no-repeat center center fixed",
      "-webkit-background-size": "cover",
      "-moz-background-size": "cover",
      "-o-background-size": "cover",
      "background-size": "cover"
    })
    $(".title").css("color", "rgb(50, 50, 50)")
  }
  if (tempFahrenheit <= 32) {
    $("body").css({
      "background": "url(https://images.unsplash.com/photo-1427955569621-3e494de2b1d2?q=80&fm=jpg&s=8d55df1cba9a968931f3fe05edb349c4) no-repeat center center fixed",
      "-webkit-background-size": "cover",
      "-moz-background-size": "cover",
      "-o-background-size": "cover",
      "background-size": "cover"
    })
    $(".title").css("color", "rgb(50, 50, 50)")
  }
  
  //Celsius and Fahrenheit button group
  $("#convert-celsius").on("click", function(e) {
    e.preventDefault()
    document.getElementById("current-temp").innerHTML = tempCelsius.toPrecision(3) + " °C"
    document.getElementById("wind-speed").innerHTML = windSpeedMetric + " m/s"
    $(this).addClass("disabled")
    $("#convert-fahrenheit").removeClass("disabled")
  })

  $("#convert-fahrenheit").on("click", function(e) {
    e.preventDefault()
    document.getElementById("current-temp").innerHTML = tempFahrenheit.toPrecision(3) + " °F"
    document.getElementById("wind-speed").innerHTML = windSpeedImperial.toPrecision(3) + " MPH"
    $(this).addClass("disabled")
    $("#convert-celsius").removeClass("disabled")
  })
}

$(document).ready(function() {
  //Uses IP address to get location data in json format
  function displayCurrentLocation(response) {
    const {city, region, country, country_code} = response
    const flag = getFlagEmoji(country_code)
    const locationDisplay = `${flag}<br>${city}, ${region},<br>${country} (${country_code})`
    document.getElementById("location").innerHTML = locationDisplay
  }
  
  async function displayCurrentLocationWeather() {
    const ipData = await fetchJsonData(ipUrl)
    displayCurrentLocation(ipData)
    
    const {city, region, country} = ipData
    const locationQuery = `${city}, ${region}, ${country}`
    const geoData = await fetchGeoData(locationQuery)
    const {lat, lon} = geoData

    const currentWeatherData = await fetchWeatherData(lat, lon)
    displayWeather(currentWeatherData)
    // loadMap(lat, lon)
  }

  displayCurrentLocationWeather()

  $('#form').trigger("reset")
  $('input').val("")
})

$("#citySubmit").submit( e => {
  e.preventDefault()
  async function main(){
    try {
        e.preventDefault()
        let inputVal = $('input').val()
        geoData = await fetchGeoData(inputVal)
        
        const {state, lat, lon, country} = geoData
        const geoName = geoData['name']
        const weatherData = await fetchWeatherData(lat, lon)

        displayWeather(weatherData)
        // updateMap(lat, lon)

        const flag = getFlagEmoji(country)
        let regionNames = new Intl.DisplayNames(['en'], {type: 'region'})
        const countryName = regionNames.of(country)

        $("#location").html(`${flag}<br>${geoName}${state ? ', ' + state : ''}<br>${countryName} (${country})`)
        $(".msg").text("")
        $('#form').trigger("reset")
        $('input').val("")
    } catch (e) {
        console.log(`error: ${e}`)
        $(".msg").text("City not found")
    }
  }

  main()
})