import { useState, useEffect } from 'react'
import countryService from './services/countryService'
import ShowInfo from './components/ShowInfo'

const App = () => {
  const [search, setSearch] = useState('')
  const [allCountries, setAllCountries] = useState([])
  const [searchedCountries, setSearchedCountries] = useState([])

  useEffect(() => {
    countryService
      .getAllCountries()
      .then(countries => {
        setAllCountries(countries.map(c => c.name.common))
      })
  }, [])

  const handleChange = (event) => {
    const searchValue = event.target.value
    setSearch(searchValue)
    const searched = allCountries.filter(c =>
      c.toLowerCase().includes(searchValue.toLowerCase())
    );
    setSearchedCountries(searched)
  }

  return (
    <div>
      find countries <input onChange={handleChange} id="search" value={search}/>
      <ShowInfo countries={searchedCountries} search={search} setSearchedCountries={setSearchedCountries}/>
    </div>
  )
}

export default App