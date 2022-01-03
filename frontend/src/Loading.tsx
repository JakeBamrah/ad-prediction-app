import React, { FunctionComponent } from 'react'
import clsx from 'clsx'

import { AlertCircle } from 'react-feather'
import { ReactComponent as NN0SVG } from './components/icons/nn1.svg';
import { ReactComponent as NN1SVG } from './components/icons/nn2.svg';
import { ReactComponent as NN2SVG } from './components/icons/nn3.svg';


export type LoadingState = "Incomplete" | "Predicting" | "Building UMAP" | "Complete" | "Failed"
const Loading: FunctionComponent<{ loading_state: LoadingState }> = (props) => {
  const { loading_state } = props

  const logos = [NN0SVG, NN1SVG, NN2SVG]
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
              {logos.map((Logo, i) => (
                <div
                  key={i}
                  style={{ animationDelay: `${(i + 1) * 3}s` }}
                  className={clsx(
                    { "hidden xs:block": i !== 1 },
                    "animate-fade opacity-10"
                  )}>
                  <Logo />
                </div>
              ))}
            </div>
            <h2 className="font-light">
              {loading_state}
            </h2>
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
            <a href="/form" className="mx-1 underline">
              revisit the form
            </a>
            and try again.
          </p>
        </div>

      </div>
    </div >
  )
}

export default Loading
