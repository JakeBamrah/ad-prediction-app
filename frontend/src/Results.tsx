import React, { FunctionComponent, useState } from 'react'
import Plot from 'react-plotly.js'
import clsx from 'clsx'

import Breadcrumb from './components/Breadcrumb'


type Section = "UMAP" | "Predict"
type ResultsProps = {
  data: any
  next_url: string
  predicted_label: number | null
}
const Results: FunctionComponent<ResultsProps> = (props) => {
  const [section, setSection] = useState<Section>(SECTIONS[0])

  const {
    data,
    next_url,
    predicted_label
  } = props

  const { rest, predicted_patient, total_samples } = data

  if (!data) {
    return (
      <></>
    )
  }

  const keys = ['AD_LABEL', 'CDR', 'MMSE', 'AGE']
  const formatCustomData = (data: any) => {
    // NOTE: ugly format the desired values into a string for custom data
    const data_len = data['AD_LABEL'].length
    const range = Array.from(Array(data_len).keys())

    const customdata = range.map((i: number) => {
      const cd_val = keys.map(k => {
        let key = k
        let val = data[k][i].toFixed(1)
        if (k === 'AD_LABEL') {
          key = 'AD Label'
          val = ad_labels[data[k][i]]
        }
        return `${key}: ${val}`
      })
      return cd_val.join('<br>')
    })
    // hack to create newlines for plotly hovertemplate
    return customdata
  }

  const color_map: { [key: number]: string } = { 1: "#73c6b6", 2: "#e74c3c", 3: "#f9e79f" }
  rest.symbols = Array(total_samples).fill('diamond')
  rest.sizes = Array(total_samples).fill(8)
  rest.colors = rest.AD_LABEL.map((n: number) => color_map[n])
  rest.opacities = Array(total_samples).fill(0.1)

  const ad_labels: { [key: number]: string } = { 1: 'Healthy / Control', 2: 'Moderate', 3: 'Severe' }
  rest.AD_LABEL_READ = rest.AD_LABEL.map((n: number) => ad_labels[n])

  predicted_patient.symbols = ['circle']
  predicted_patient.sizes = [24]
  predicted_patient.colors = [4]
  predicted_patient.colors = [1]
  predicted_patient.AD_LABEL_READ = [ad_labels[predicted_patient.AD_LABEL]]

  const sample_patients = {
    x: rest.x, y: rest.y, z: rest.z,
    mode: 'markers',
    name: 'Sample patients',
    customdata: formatCustomData(rest),
    hovertemplate: "%{customdata}",
    marker: {
      size: rest.sizes,
      symbol: rest.symbols,
      opacity: rest.opacities,
      color: rest.colors,
    },
    type: 'scatter3d'
  }

  const predicted = {
    x: predicted_patient.x, y: predicted_patient.y, z: predicted_patient.z,
    mode: 'markers',
    name: 'Predicted patient',
    customdata: formatCustomData(predicted_patient),
    hovertemplate: "%{customdata}",
    marker: {
      size: predicted_patient.sizes,
      symbol: predicted_patient.symbols,
      opacity: predicted_patient.opacities,
      line: {
        color: predicted_patient.colors,
      },
    },
    type: 'scatter3d'
  }

  const layout = {
    width: 400,
    height: 400,
    showlegend: true,
    legend: {
      x: 1,
      y: 1,
      xanchor: 'right',
    },
    plot_bgcolor: "#F1F5F9",
    paper_bgcolor: "#F1F5F9",

    // remove plot padding
    margin: {
      l: 0,
      r: 0,
      b: 0,
      t: 0,
      pad: 0
    },
    // initialze axis facing predicted node
    xaxis: [0, predicted_patient.x],
    yaxis: [0, predicted_patient.y],
    zaxis: [0, predicted_patient.z]
  }

  // TODO: make graph points more contrasty colours
  // Provide explanation for points

  // hide plotly options
  const config = { displayModeBar: false }

  const plot = [sample_patients, predicted]

  return (
    <div
      className={`
        flex flex-col space-y-6 relative h-full w-full items-center justify-center
      `}>
      <h2>Results</h2>
      <div className={`
          flex flex-col sm:flex-row items-center sm:items-start
          space-y-6 sm:space-y-0 space-x-4 space-between
          w-full h-full text-justify
          overflow-y-scroll overflow-x-hidden sm:overfow-y-auto
      `}>
        <div className="hidden basis-20 pl-2 sm:basis-1/2 sm:block">
          <Breadcrumb
            selected={section}
            breadcrumbs={SECTIONS}
            onSelect={(section) => setSection(section as Section)}
          />
        </div>
        <div className={clsx(
          section === 'UMAP' ? 'block' : 'hidden',
          "basis-1/2"
        )}>
          <Plot
            data={plot}
            layout={layout}
            config={config}
          />
        </div>
        <div className={clsx(
          section === 'Predict' ? 'block sm:block' : 'block sm:hidden',
          "sm:basis-1/2 w-full h-full flex flex-col items-center justify-center",
          "pb-4"
        )}>
          <h2 className="block sm:hidden pb-4">Prediction Stats</h2>
          <div className="text-left">
            <p>Predicted label: {ad_labels[predicted_label ?? 1]}</p>
            <p>Age: {Math.round(predicted_patient['AGE'])}</p>
            <p>Mini-Mental State Exam: {Math.round(predicted_patient['MMSE'])}</p>
            <p>Clinical Dimentia Rating (CDR): {predicted_patient['CDR']}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

const SECTIONS: Section[] = [
  "UMAP",
  "Predict"
]

export default Results
