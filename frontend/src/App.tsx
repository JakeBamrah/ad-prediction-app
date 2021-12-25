import React from 'react'

import { AwsClient } from 'aws4fetch'


const EXAMPLE = {
  "AGE": 84.8186,
  "CDR": 25,
  "PTGENDER": 2,
  "PTEDUCAT": 18,
  "FATHDEM": 0,
  "MOTHDEM": 0,
  "MODHACH_SCORE": 0,
  "NPITOTAL": 0,
  "ADAS_TOTAL": 30,
  "LOG_MEM_IMM_TOTAL": 15,
  "MMSE": 30,
  "COMP_MEM_SCORE": 2.033,
  "COMP_EXEC_FUNC_SCORE": 0.574,
  "LOG_MEM_DEL_TOTAL": 11,
  "CBB_SCORE_%": 83.44298245614036,
}
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
    body: JSON.stringify({ patient_to_label: EXAMPLE })
  })
  const data = await response.json()

  console.log(import.meta.env['VITE_AWS_API_URL'])
  console.log(data.body['predicted_label'])
  return
}

const App = () => {
  // this works
  sign()

  return (
    <div>Testing AD prediction api</div>
  )
}

export default App
