import axios from 'axios'

/* export const BeApiUrl = process.env.VUE_APP_BE_API_URL */

const service = axios.create({

  baseURL: process.env.VUE_APP_BE_API_URL
})

service.interceptors.request.use(

  config => {
    return config
  },
  error => {
    console.log(error)
    /*  return Promise.reject() */
  }
)

service.interceptors.response.use(
  response => {
    // console.log(response.status)
    if (response.status === 200) {
      // console.log('response', response)
      return response.data
    } else {
      /* Promise.reject() */
    }
  },
  error => {
    console.log(error)
    /*  return Promise.reject() */
  }
)

export default service
