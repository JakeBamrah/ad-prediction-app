import React, { useState, useMemo } from 'react'
import { Switch, Route, BrowserRouter, Redirect } from 'react-router-dom'

import { loadAssets } from './data/AssetLoader'
import PredictService from './data/PredictService'

import Home from './Home'
import Disclaimer from './Disclaimer'
import Form, { FormValues } from './Form'
import Loading, { LoadingState } from './Loading'


const App = () => {
  const [data, setData] = useState<any>(null)
  const [predicted_label, setPredictedLabel] = useState<number | null>(null)
  const [loading_state, setLoadingState] = useState<LoadingState>("incomplete")

  const predict_service = useMemo(() => new PredictService(), [])

  const [loading, setLoading] = useState<boolean>(true)
  if (loading) {
    loadAssets().then(() => setLoading(false))
    return <div
      className={`
        h-screen overflow-x-hidden text-transparent
        bg-gradient-to-l from-slate-300 to-slate-200
      `}
    > Loading
    </div>
  }

  const onSubmit = (values: FormValues) => {
    predict_service.predict(values)
      .then(resp => {
        const { predicted_label, data, normalized_data } = resp.body
        const embeddings = predict_service.buildUMAPEmbeddings(normalized_data)
        const data_emb = {
          ...data,
          'x': embeddings[0],
          'y': embeddings[1],
          'z': embeddings[2]
        }
        setData(data_emb)
        setPredictedLabel(predicted_label)
      })
    return
  }
  console.log(predicted_label)

  return (
    <div className={`
        flex h-screen items-center justify-center sm:px-8 sm:py-4
        bg-gradient-to-l from-slate-300 to-slate-200
        text-slate-400
    `}>
      <div className={`
        h-4/6 sm:h-full w-full sm:max-h-128 sm:max-w-4xl sm:rounded-2xl
        p-8 sm:p-12
        bg-slate-150 neumorph-light
      `}>
        <BrowserRouter>
          <Switch>
            <Route exact path="/">
              <Home next_url="/disclaimer" />
            </Route>

            <Route exact path="/disclaimer">
              <Disclaimer next_url="/form" />
            </Route>

            <Route exact path="/form">
              <Form onSubmit={onSubmit} />
            </Route>

            <Loading loading_state={loading_state} />

            <Redirect from="*" to="/" />
          </Switch>
        </BrowserRouter>
      </div>
    </div>
  )
}

export default App
