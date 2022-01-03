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
          layout={{
            width: 450,
            height: 400,
            showlegend: true
          }}
        />
      </div>
    </div>
  )
}

export default Results
