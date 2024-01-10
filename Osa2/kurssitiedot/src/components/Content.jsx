import Part from './Part'

const Content = ({content}) => {
    const parts = content.map(content => <Part key={content.id} part={content}/>)
    const total = content.reduce((s, p) => s + p.exercises, 0)
    return (
      <>
        {parts}
        <b>total of {total} exercises</b>
      </>
    )
  }
  
  export default Content