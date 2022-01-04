import React, { FunctionComponent } from 'react'
import clsx from 'clsx'
import { Link } from 'react-router-dom'

import { AlertCircle } from 'react-feather'
import { ReactComponent as LogoFilled } from './assets/logo_round_filled.svg'


export type LoadingState = "Incomplete" |
  "Predicting" |
  "Building UMAP" |
  "Complete" |
  "Failed"
const Loading: FunctionComponent<{ loading_state: LoadingState }> = (props) => {
  const { loading_state } = props

  const hidden = ["Incomplete", "Complete"].includes(loading_state)
  const loading = ['Predicting', 'Building UMAP'].includes(loading_state)
  return (
    <div className={clsx(
      hidden ? "hidden" : "block",
      "h-full w-full bg-transparent"
    )}>
      <div
        className={clsx(
          "h-full flex items-center font-medium select-none justify-center"
        )}>
        {loading &&
          <div
            className={clsx(
              loading ? 'block' : 'hidden',
              "flex flex-col items-center")}>
            <div className="flex">
              <div
                style={{ animationDuration: '4s' }}
                className={clsx(
                  "animate-fade bg-slate-400 rounded-full mb-6 opacity-5"
                )}>
                <LogoFilled className="h-64-w-64" />
              </div>
            </div>
            <h4 className="font-light">
              {loading_state}
            </h4>
          </div>
        }
        <div
          className={clsx(
            loading_state === 'Failed' ? 'block' : 'hidden',
            "flex flex-col items-center text-center select-none"
          )}>
          <AlertCircle className="h-16 w-16 text-red-300 mb-6" />
          <h2 className="font-light mb-2">
            {loading_state}
          </h2>
          <p>Request failed—please
            <Link to="/form" className="mx-1 underline">
              revisit the form
            </Link>
            and try again.
          </p>
        </div>

      </div>
    </div >
  )
}

export default Loading
