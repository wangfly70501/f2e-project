import axios from 'axios'

const service = axios.create({
  // process.env.NODE_ENV === 'development' 来判断是否开发环境
  // easy-mock服务挂了，暂时不使用了
  baseURL: 'http://192.168.50.105:7777'
  /*   baseURL: window.location.protocol + '//btcbox.com.tw:7777' */

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
