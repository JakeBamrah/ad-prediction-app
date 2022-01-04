import React, { useState, useMemo } from 'react'
import { Switch, Route, Redirect, Link, useHistory, useLocation } from 'react-router-dom'
import clsx from 'clsx'
import { GitHub } from 'react-feather'

import { loadAssets } from './data/AssetLoader'
import PredictService from './data/PredictService'

import Home from './Home'
import Disclaimer from './Disclaimer'
import Form, { FormValues } from './Form'
import Results from './Results'
import Loading, { LoadingState } from './Loading'
import { ReactComponent as Logo } from './assets/logo_small_use.svg'


const App = () => {
  const [data, setData] = useState<any>(null)
  const [predicted_label, setPredictedLabel] = useState<number | null>(null)

  const [app_loading, setAppLoading] = useState<boolean>(true)

  const [loading_state, setLoadingState] = useState<LoadingState>('Incomplete')
  const resetLoadingState = () => setLoadingState('Incomplete')

  const history = useHistory()

  const location = useLocation()
  const at_home = location.pathname === "/"

  const predict_service = useMemo(() => new PredictService(), [])

  if (app_loading) {
    loadAssets().then(() => setAppLoading(false))
    return <div
      className={`
        h-screen overflow-x-hidden text-transparent
        bg-gradient-to-l from-slate-300 to-slate-200
      `}
    > Loading
    </div>
  }

  const onSubmit = (values: FormValues) => {
    setLoadingState('Predicting')
    predict_service.predict(values)
      .then(resp => {
        setLoadingState('Building UMAP')
        const { predicted_label, data, normalized_data } = resp.body
        const embeddings = predict_service.buildUMAPEmbeddings(normalized_data)
        const data_emb = {
          ...data,
          'x': embeddings[0],
          'y': embeddings[1],
          'z': embeddings[2]
        }

        // separate out rest and predicted patient for visualizing
        const emb_len = normalized_data.length
        const keys = Object.keys(data_emb)
        const rest: { [key: string]: number[] } = {}
        const predicted_patient: { [key: string]: number[] } = {}
        keys.forEach(k => {
          const slice = data_emb[k].slice(0, emb_len - 2)
          rest[k] = slice
          predicted_patient[k] = [data_emb[k][emb_len - 1]]
        })

        setData({ rest, predicted_patient, total_samples: emb_len })
        setPredictedLabel(predicted_label)

        setLoadingState('Complete')
        history.push("/results")
        return
      })
      .catch(e => {
        setLoadingState('Failed')
        return
      })
    return
  }

  return (
    <div className={`
        flex flex-col h-screen items-center justify-center sm:px-8 py-0 sm:py-4
        bg-gradient-to-l from-slate-300 to-slate-200
        text-slate-400 relative
    `}>
      {!at_home &&
        <div className="w-full sm:max-w-4xl px-4 -mb-6">
          <Link onClick={resetLoadingState} to="/">
            <Logo className="h-32 w-32" />
          </Link>
        </div>
      }
      <div className={`
        h-4/6 sm:h-full w-full sm:max-h-128 sm:max-w-4xl sm:rounded-2xl
        p-8 sm:p-12 relative
        bg-slate-100 neumorph-light
      `}>
        <Switch>
          <Route exact path="/">
            <Home next_url="/disclaimer" />
          </Route>

          <Route exact path="/disclaimer">
            <Disclaimer next_url="/form" />
          </Route>

          <Route exact path="/form">
            <div className={clsx(
              { "hidden": loading_state !== "Incomplete" },
              "h-full"
            )} >
              <Form onSubmit={onSubmit} />
            </div>
            <Loading loading_state={loading_state} />
          </Route>

          <Route exact path="/results">
            {data &&
              <Results
                data={data}
                predicted_label={predicted_label}
                next_url="/form"
                onReset={resetLoadingState}
              />
            }
          </Route>

          <Redirect from="*" to="/" />
        </Switch>
      </div>
      <a
        target="_blank"
        rel="noreferrer"
        className="flex pt-6 bottom-20"
        href="https://github.com/JakeBamrah/ad_prediction_app"
      >
        <p>Github</p>
        <GitHub className="ml-1 mt-1 h-3 w-3" />
      </a>
    </div>
  )
}

export default App
