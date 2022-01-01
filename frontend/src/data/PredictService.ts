import { AwsClient } from 'aws4fetch'
import { UMAP } from 'umap-js'


type Embedding = number[]

export default class PredictService {
  private client: AwsClient
  private api_url: string

  constructor() {
    this.api_url = import.meta.env['VITE_AWS_API_URL'] as string
    this.client = new AwsClient({
      service: 'execute-api',
      region: 'eu-west-1',
      accessKeyId: import.meta.env['VITE_AWS_ACCESS_KEY_ID'] as string,
      secretAccessKey: import.meta.env['VITE_AWS_SECRET_ACCESS_KEY'] as string
    })
  }

  async predict(patient_to_label: any) {
    // returns an object with signed with the authorized headers containing a
    // signed url, for example: 'Authorization' and 'X-Amz-Date'
    const response = await this.client.fetch(this.api_url, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ patient_to_label }),
    })
    const data = await response.json()

    return data
  }

  buildUMAPEmbeddings (arr: Embedding[]) {
    const umap = new UMAP({
      nComponents: 3,
      nNeighbors: 5,
      minDist: 0.0,
    })
    const _embeddings = umap.fit(arr)
    const embeddings = _embeddings.reduce(this.pivotEmbeddings, [[], [], []])

    return embeddings
  }

  pivotEmbeddings (prev: Embedding[], curr: Embedding) {
    prev.forEach((p, i) => p.push(curr[i]))
    return prev
  }
}
