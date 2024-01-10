const Persons = ({persons, deleteNumber}) => {
    return (
      <>
        {persons.map(person => <p key={person.name}> {person.name} {person.number} <button onClick={() => deleteNumber(person)}>delete</button></p>)}      
      </>
    )
  }
  
  export default Persons