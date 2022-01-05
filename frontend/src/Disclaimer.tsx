import React, { FunctionComponent } from 'react'
import { Link } from 'react-router-dom'

import Button from './components/Button'


type DisclaimerProps = {
  next_url: string
}
const Disclaimer: FunctionComponent<DisclaimerProps> = ({ next_url }) => {
  return (
    <div
      className={`
        flex flex-col space-y-6 relative h-full w-full items-center
      `}>
      <h2>Disclaimer</h2>
      <div className="hidden sm:block space-y-4 text-justify">
        <p>
          Any data provided for evaluation is <b>not</b> retained.
        </p>
        <p>
          Commercial use of this app or any of it's resources are prohibited.
        </p>
        <p>
          Data used for prediction and evaluation against the
          given input has been provided by the
          <a
            className="ml-1 underline"
            href="https://adni.loni.usc.edu/"
            rel="noreferrer"
            target="_blank"
          >
            Alzheimer's Disease Neuroimaging Initiative
          </a>.
        </p>
        <p>
          This application has been built as a continuation of prior research carried
          out on
          <a
            className="ml-1 underline"
            href="https://github.com/JakeBamrah/ad_prediction_app"
            rel="noreferrer"
            target="_blank"
          >
            computer-aided diagnosis using Graph Neural Networks
          </a>
          —it has been provided for demonstration purposes only.
        </p>
        <p>
          Please see
          <a
            className="mx-1 underline"
            href="https://github.com/JakeBamrah/ad_prediction_app"
            rel="noreferrer"
            target="_blank"
          >
            README
          </a>
          for more information on how to use the application.
        </p>
        <p>
          This project is funded and provided by the creator.
        </p>
      </div>
      <div className="block sm:hidden space-y-4">
        <p>
          Any data provided for evaluation is <b>not</b> retained.
        </p>
        <p>
          Commercial use of this app or any of it's resources are prohibited.
        </p>
        <p>
          The original datasets were provided by the
          <a
            className="ml-1 underline"
            href="https://adni.loni.usc.edu/"
            rel="noreferrer"
            target="_blank"
          >
            Alzheimer's Disease Neuroimaging Initiative
          </a>.
        </p>
        <p>
          This application is for demonstration purposes only.
        </p>
        <p>
          Please see
          <a
            className="mx-1 underline"
            href="https://github.com/JakeBamrah/ad_prediction_app"
            rel="noreferrer"
            target="_blank"
          >
            README
          </a>
          for more information on how to use the application.
        </p>
        <p>
          This project is funded and provided by the creator.
        </p>
      </div>
      <div className="absolute bottom-0 right-0">
        <Link to={next_url}>
          <Button>
            Agree & continue
          </Button>
        </Link>
      </div>
    </div>
  )
}

export default Disclaimer
