import React, { FunctionComponent } from 'react'
import { Link } from 'react-router-dom'

import Button from './components/Button'


type HomeProps = {
  next_url: string
}
const Home: FunctionComponent<HomeProps> = ({ next_url }) => {
  return (
    <div
      className={`
        flex flex-col space-y-6 h-full w-full items-center justify-center
      `}>
      <div className="h-48 w-48 bg-slate-300 rounded-full" />
      <h2>ADGraph</h2>
      <p className="hidden sm:block">
        Alzheimer's disease prediction and visualization
      </p>
      <p className="block sm:hidden whitespace-pre-line text-center">
        Alzheimer's disease prediction <br /> and visualization
      </p>
      <Link to={next_url}>
        <Button>
          Predict
        </Button>
      </Link>
    </div>
  )
}

export default Home
