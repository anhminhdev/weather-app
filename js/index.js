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

// Virtual Assistant
var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;

const recognition = new SpeechRecognition();
recognition.lang = 'vi-VI'
recognition.continuous = false

const synth = window.speechSynthesis

const microphone = document.querySelector('.microphone')

const speak = (text) => {
  if (synth.speaking) {
    console.error('Sorry, I am speaking...')
    return
  }

  const utter = new SpeechSynthesisUtterance(text)
  utter.onend = () => {
    console.log('SpeechSynthesisUtterance.onend')
  }
  utter.onerror = (err) => {
    console.error('SpeechSynthesisUtterance.onerror', err)
  }

  synth.speak(utter)
}

const handleVoice = (text) => {
  console.log('text:', text)

  const handleText = text.toLowerCase()
  // "thời tiết tại đà nẵng" => ['thời tiết ', ' đà nẵng']
  if (handleText.includes('thời tiết tại')) {
    const location = handleText.split('tại')[1].trim()

    console.log('location: ', location)
    searchInput.value = location
    const changeEvent = new Event('change')
    searchInput.dispatchEvent(changeEvent)
    return
  }

  const container = document.querySelector('.container')
  if (handleText.includes('thay đổi màu nền')) {
    const color = handleText.split('màu nền')[1].trim()
    container.style.background = color
    return
  }
  if (handleText.includes('màu nền mặc định')) {
    container.style.background = ''
    return
  }

  if (handleText.includes('mấy giờ')) {
    const textToSpeech = `${moment().hours()} hours ${moment().minutes()} minutes`
    speak(textToSpeech)
    return
  }

  speak('Please try again')
}

microphone.addEventListener('click', (e) => {
  e.preventDefault()

  recognition.start();
  microphone.classList.add('recording')
})

recognition.onspeechend = () => {
  recognition.stop()
  microphone.classList.remove('recording')
}

recognition.onerror = (event) => {
  console.error(`Speech recognition error detected: ${event.error}`);
  microphone.classList.remove('recording')
};


recognition.onresult = (e) => {
  console.log("onresult", e)
  const text = e.results[0][0].transcript
  handleVoice(text)
}
