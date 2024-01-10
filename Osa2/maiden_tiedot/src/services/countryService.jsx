import axios from 'axios'
const baseUrl = 'https://studies.cs.helsinki.fi/restcountries/api'
const weatherUrl1 = 'https://api.open-meteo.com/v1/forecast?latitude='
const weatherUrl2 = '&longitude='
const weatherUrl3 = '&current=temperature_2m,wind_speed_10m'

const getAllCountries = () => {
  const request = axios.get(`${baseUrl}/all`)
  return request.then(response => response.data)
}

const getCountry = (country) => {
    const request = axios.get(`${baseUrl}/name/${country}`)
    return request.then(response => response.data)
}

const getWeather = (latlng) => {
    const request = axios.get(`${weatherUrl1}${latlng[0]}${weatherUrl2}${latlng[1]}${weatherUrl3}`)
    return request.then(response => response.data)
}

export default {getAllCountries, getCountry, getWeather}