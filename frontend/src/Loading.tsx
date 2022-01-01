import React, { FunctionComponent } from 'react'

import clsx from 'clsx'


export type LoadingState = "incomplete" | "predicting" | "creating_umap" | "complete"
const Loading: FunctionComponent<{ loading_state: LoadingState }> = (props) => {
  const { loading_state } = props

  const hidden = ["incomplete", "complete"].includes(loading_state)
  return (
    <div className={clsx(
      hidden ? "hidden" : "block",
    )}>
    </div>
  )
}

export default Loading
