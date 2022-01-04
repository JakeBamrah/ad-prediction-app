import React, { FunctionComponent } from 'react'
import { Link } from 'react-router-dom'

import Button from './components/Button'
import { ReactComponent as Logo } from './assets/logo.svg'


type HomeProps = {
  next_url: string
}
const Home: FunctionComponent<HomeProps> = ({ next_url }) => {
  return (
    <div
      className={`
        flex flex-col space-y-6 h-full w-full items-center justify-center
      `}>
        <Logo className="h-48 w-48 xs:h-64 xs:w-64 -mb-10"/>
      <p className="hidden xs:block border-t-2 pt-5">
        Alzheimer's disease prediction and visualization
      </p>
      <p className="block xs:hidden whitespace-pre-line text-center border-t-2 pt-5">
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
