const APP_ID = '37d1364b611d578fe924e8412da6de60';
const searchInput = document.querySelector('#search-input')
const DEFAULT_VALUE = '--'

// Element main-section
const cityName = document.querySelector('.city-name')
const weatherState = document.querySelector('.weather-state')
const weatherIcon = document.querySelector('.weather-icon')
const temperature = document.querySelector('.temperature')

// Element additional-section
const sunrise = document.querySelector('.sunrise')
const humidity = document.querySelector('.humidity')
const sunset = document.querySelector('.sunset')
const windSpeed = document.querySelector('.wind-speed')


searchInput.addEventListener('change', (e) => {
  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${e.target.value}&appid=${APP_ID}&units=metric`)
    .then(async (res) => {
      const data = await res.json()
      console.log('[Search Input]', data)
      cityName.innerHTML = data.name || DEFAULT_VALUE
      weatherState.innerHTML = data.weather[0].description || DEFAULT_VALUE
      weatherIcon.setAttribute('src', `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`)
      temperature.innerHTML = Math.round(data.main.temp) || DEFAULT_VALUE
      humidity.innerHTML = data.main.humidity || DEFAULT_VALUE

      sunrise.innerHTML = moment.unix(data.sys.sunrise).format('H:mm') || DEFAULT_VALUE
      sunset.innerHTML = moment.unix(data.sys.sunset).format('H:mm') || DEFAULT_VALUE
      windSpeed.innerHTML = (data.wind.speed * 3.6).toFixed() || DEFAULT_VALUE
    })
})