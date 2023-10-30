import { useState } from 'react'

const Button = ({ handleClick, text }) => (
  <button onClick={handleClick}>
    {text}
  </button>
)

const StatisticLine = ({text, value}) => {
  if (text === "positive") {
    return(
      <tr>
        <td>{text}</td>
        <td>{value*100} %</td>
      </tr>
    )
  }

  return(
    <tr>
      <td>{text}</td>
      <td>{value}</td>
    </tr>
  )
}

const Statistics = ({statisticsValues}) => {
  if (statisticsValues[3] === 0) {
    return(
      <div>
        No feedback given
      </div>
    )
  }

  return(
    <table>
      <tbody>
        <StatisticLine text="good" value ={statisticsValues[0]} />
        <StatisticLine text="neutral" value ={statisticsValues[1]} />
        <StatisticLine text="bad" value ={statisticsValues[2]} />
        <StatisticLine text="all" value ={statisticsValues[3]} />
        <StatisticLine text="average" value ={statisticsValues[4]} />
        <StatisticLine text="positive" value ={statisticsValues[5]} />
      </tbody>
    </table>
  )
}

const App = () => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  const [all, setAll] = useState(0)
  const [average, setAverage] = useState(0)
  const [positive, setPositive] = useState(0)
  const statisticsValues = [good, neutral, bad, all, average, positive]

  const handleGoodClick = () => {
    const newGood = good + 1
    setGood(newGood)
    updateStatistics(newGood, bad, all)
  }

  const handleNeutralClick = () => {
    setNeutral(neutral + 1)
    updateStatistics(good, bad, all)
  }

  const handleBadClick = () => {
    const newBad = bad + 1
    setBad(newBad)
    updateStatistics(good, newBad, all)
  }

  const updateStatistics = (good, bad, all) => {
    const newAll = all + 1
    setAll(newAll)
    setAverage((good-bad)/newAll)
    setPositive(good/newAll)
  }

  return (
    <div>
      <h1>give feedback</h1>
      <Button handleClick={handleGoodClick} text="good" />
      <Button handleClick={handleNeutralClick} text="neutral" />
      <Button handleClick={handleBadClick} text="bad" />
      <h1>statistics</h1>
      <Statistics statisticsValues={statisticsValues} />
    </div>
  )
}

export default App