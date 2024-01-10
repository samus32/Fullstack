import { useState, useEffect } from "react"
import countryService from "../services/countryService"

const Country = ({countryInfo}) => {
  const [weather, setWeather] = useState(null)

  useEffect(() => {
    countryService
    .getWeather(countryInfo.capitalInfo.latlng)
    .then(w => {
      setWeather(w)  
    })
  }, [countryInfo])

  if (weather !== null) {
    return (
        <div>
        <h1>{countryInfo.name.common}</h1>
        <div>Capital: {countryInfo.capital[0] + "\n"}</div>
        <div>Area: {countryInfo.area}</div>
        <h3>Languages:</h3>
        {Object.entries(countryInfo.languages).map(([key, value]) => <li key={key}>{value}</li>)}
        <img
            src={countryInfo.flags.png}
            alt='flag'
        />
        <h2>Weather in {countryInfo.capital[0]}</h2>
        <div>temperature {weather.current.temperature_2m} celsius</div>
        <div>wind speed {weather.current.wind_speed_10m} km/h</div>
        </div>
    )
  }
}
  
export default Country