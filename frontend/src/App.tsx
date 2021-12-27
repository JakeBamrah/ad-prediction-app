import React from 'react'

import { AwsClient } from 'aws4fetch'
import { UMAP } from 'umap-js'

import { EXAMPLE, norm_arr } from './normArr'


async function sign() {
  const aws = new AwsClient({
    service: 'execute-api',
    region: 'eu-west-1',
    accessKeyId: import.meta.env['VITE_AWS_ACCESS_KEY_ID'] as string,
    secretAccessKey: import.meta.env['VITE_AWS_SECRET_ACCESS_KEY'] as string
  })

  // returns an object with signed with the authorized headers containing a
  // signed url, for example: 'Authorization' and 'X-Amz-Date'
  const api_url = import.meta.env['VITE_AWS_API_URL'] as string
  const response = await aws.fetch(api_url, {
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ patient_to_label: EXAMPLE }),
  })
  const data = await response.json()

  return data
}

const buildUMAPEmbeddings = (arr: number[][]) => {
  const umap = new UMAP({
    nComponents: 3,
    nNeighbors: 5,
    minDist: 0.0,
  })
  const embeddings = umap.fit(arr)
  return embeddings
}

const App = () => {
  // sign()

  const n_arr = norm_arr.flat()
  const embeddings = buildUMAPEmbeddings(n_arr)

  return (
    <div>Testing AD prediction api</div>
  )
}

export default App
