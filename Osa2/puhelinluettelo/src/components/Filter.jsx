const Filter = (props) => {
  return (
    <>
      filter shown with <input onChange={props.function} id="filter" value={props.value}/>
    </>
  )
}

export default Filter