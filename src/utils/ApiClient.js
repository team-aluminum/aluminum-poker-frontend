import axios from 'axios'

export default (method, url, data = null) => {
  url = process.env.VUE_APP_API_ENDPOINT + url
  if (method.toLowerCase() === 'get') {
    return axios({ method, url })
  } else {
    return axios({ method, url, data })
  }
}
