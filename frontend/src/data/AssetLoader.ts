export const loadAssets = async () => {
  await fontLoader('./src/fonts/Graphik-Regular.woff2')
  return fontLoader('./src/fonts/Graphik-Regular.ttf')
}

const fontLoader = (path: string) => {
  // send dummy request to retrieve fonts
  // this way we can ensure fonts are present before rendering
  return new Promise((resolve, reject) => {
    try {
      const request = new XMLHttpRequest();
      request.open("GET", path, true);
      request.onload = (e) => {
        if (request.status >= 200 && request.status < 400) {
          // let data = request.responseText;
          resolve(request.status)
        } else {
          reject('Bad request. request status: ' + request.status);
        }
      }
      request.send()
    } catch (err) {
      reject(err)
    }
  })
}
