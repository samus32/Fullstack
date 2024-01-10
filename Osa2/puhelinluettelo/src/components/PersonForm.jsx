const PersonForm = (props) => {
    return (
      <form onSubmit={props.submitFunction}>
        <div>
          name: <input onChange={props.nameFunction} id="name" value={props.nameValue}/>
        </div>
        <div>
          number: <input onChange={props.numberFunction} id="number" value={props.numberValue}/>
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
    )
  }
  
  export default PersonForm