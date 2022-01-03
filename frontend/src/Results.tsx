import React, { FunctionComponent, useLayoutEffect } from 'react'
import Plot from 'react-plotly.js'


type ResultsProps = {
  next_url: string
  data: any
}
const Results: FunctionComponent<ResultsProps> = (props) => {
  const {
    data,
    next_url
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
      const cd_val = keys.map(k => `${k}: ${data[k][i].toFixed(1)}`)
      return cd_val.join('<br>')
    })
    // hack to create newlines for plotly hovertemplate
    return customdata
  }

  rest.symbols = Array(total_samples).fill('x')
  rest.sizes = Array(total_samples).fill(6)
  rest.colors = rest.AD_LABEL
  rest.opacities = Array(total_samples).fill(0.1)

  predicted_patient.symbols = ['circle']
  predicted_patient.sizes = [24]
  predicted_patient.colors = [4]
  predicted_patient.colors = [1]

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
      line: {
        color: rest.colors,
      },
    },
    type: 'scatter3d'
  };

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
  };

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
    xaxis:[0, predicted_patient.x],
    yaxis:[0, predicted_patient.y],
    zaxis:[0, predicted_patient.z]
  }

  // hide plotly options
  const config = { displayModeBar: false }

  const plot = [sample_patients, predicted]

  return (
    <div
      className={`
        flex flex-col space-y-6 relative h-full w-full items-center justify-center
      `}>
      <h2>Results</h2>
      <div className="space-y-4 text-justify">
        <Plot
          data={plot}
          layout={layout}
          config={config}
        />
      </div>
    </div>
  )
}

export default Results
