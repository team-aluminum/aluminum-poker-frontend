import axios from 'axios'

export default (method, url, data = null) => {
  if (method.toLowerCase() === 'get') {
    return axios({ method, url })
  } else {
    return axios({ method, url, data })
  }
}
