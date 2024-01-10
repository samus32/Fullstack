import { useState, useEffect } from 'react'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import PersonService from './services/PersonService'
import Notification from './components/Notification'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [filteredPersons, setFilteredPersons] = useState(persons)
  const [successMessage, setSuccessMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  useEffect(() => {
    PersonService
      .getPersons()
      .then(initialPersons => {
        setPersons(initialPersons)
        setFilteredPersons(initialPersons)
      })
  }, [])

  const addNumber = (event) => {
    event.preventDefault()
    let addNewNumber = true
    if (persons.some(person => person.name === newName)) {
      addNewNumber = false
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        const person = filteredPersons.find(p => p.name === newName)
        const changedNumber = {...person, number: newNumber}
        PersonService
          .changeNumber(person.id, changedNumber)
          .then(returnedPerson => {
            setPersons(persons.map(p => p.id !== returnedPerson.id ? p : returnedPerson))
            setFilteredPersons(filteredPersons.map(p => p.id !== returnedPerson.id ? p : returnedPerson))
            setNewName('')
            setNewNumber('')
            setSuccessMessage(`Changed the number of ${returnedPerson.name}`)
            setTimeout(() => {
              setSuccessMessage(null)
            }, 2000)
          })
          .catch(error => {
            setErrorMessage(`Information of ${person.name} has already been removed from server`)
            setTimeout(() => {
              setErrorMessage(null)
            }, 2000)
            setPersons(filteredPersons.filter(p => p.id !== person.id))
            setFilteredPersons(filteredPersons.filter(p => p.id !== person.id))
          })
      }
    } 
    if (addNewNumber) {
      const person = {
        name: newName,
        number: newNumber
      }
      PersonService
        .addPerson(person)
        .then(newPerson => {
          setPersons(persons.concat(newPerson))
          setFilteredPersons(filteredPersons.concat(newPerson))
          setNewName('')
          setNewNumber('')
          setSuccessMessage(`Added ${newPerson.name}`)
          setTimeout(() => {
            setSuccessMessage(null)
          }, 2000)
        })
    }
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    const filterValue = event.target.value;
    setFilter(filterValue);
    const filtered = persons.filter((person) =>
      person.name.toLowerCase().includes(filterValue.toLowerCase())
    );
    setFilteredPersons(filtered);
  }

  const deleteNumber = (personToBeDeleted) => {
    if (window.confirm("Do you want to delete " + personToBeDeleted.name + "?")) {
      const id = personToBeDeleted.id
      PersonService
          .deletePerson(id)
          .then(() => {
            setPersons(filteredPersons.filter(person => person.id !== id))
            setFilteredPersons(filteredPersons.filter(person => person.id !== id))
            setSuccessMessage(`Deleted ${personToBeDeleted.name}`)
            setTimeout(() => {
              setSuccessMessage(null)
            }, 2000)
          })
    }
  }

  return (
    <div>
      <h1>Phonebook</h1>
      <Notification message={successMessage} notificationType={'success'}/>
      <Notification message={errorMessage} notificationType={'error'}/>
      <Filter function={handleFilterChange} value={filter}/>
      <h2>Add a new</h2>
      <PersonForm submitFunction={addNumber}
                  nameFunction={handleNameChange} nameValue={newName}
                  numberFunction={handleNumberChange} numberValue={newNumber}/>
      <h2>Numbers</h2>
      <Persons persons={filteredPersons} deleteNumber={deleteNumber}/>  
    </div>
  )

}

export default App