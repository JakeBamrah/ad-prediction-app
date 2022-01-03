import React, { FunctionComponent } from 'react'
import { Link } from 'react-router-dom'

import Button from './components/Button'


type ResultsProps = {
  next_url: string
}
const Results: FunctionComponent<ResultsProps> = ({ next_url }) => {
  return (
    <div
      className={`
        flex flex-col space-y-6 relative h-full w-full items-center justify-center
      `}>
      <h2>Results</h2>
      <div className="hidden sm:block space-y-4 text-justify">
      </div>
    </div>
  )
}

export default Results
