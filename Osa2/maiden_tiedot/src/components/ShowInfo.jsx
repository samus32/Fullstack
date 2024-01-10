import { useState, useEffect } from "react"
import countryService from "../services/countryService"
import Country from "./Country"

const ShowInfo = ({countries, search, setSearchedCountries}) => {
  const count = countries.length  
  const [country, setCountry] = useState(null)

  useEffect(() => {
    if (count === 1) {
      countryService
        .getCountry(countries[0])
        .then(countryData => {
          setCountry(countryData)
        })
    }
  }, [search]);

  const showCountry = (c) => {
    countryService
        .getCountry(c)
        .then(countryData => {
          setCountry(countryData)
        })
    setSearchedCountries([country])
  }

  if (count < 11 && count > 1) {
    return (
      <>
        {countries.map(c => <li key={c}>{c} <button onClick={() => showCountry(c)}>show</button></li>)}
      </>
    )
  }

  if (count === 1 && country) {
    return (
      <Country countryInfo={country}/>
    )
  }

  if (search.length !== 0 && count > 10) {
    return (
      <div>
        Too many matches, specify another filter
      </div>
    )
  }
}
  
export default ShowInfo