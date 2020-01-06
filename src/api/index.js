import request from '../utils/request'

// 手續費資料
export const chargeData = query => {
  return request({
    url: './bankendapi?method=ex_fee',
    method: 'post',
    data: query
  })
}
/*
export const searchCharge = query => {
  // console.log('create')
  return request({
    url: './bankendapi?method=ex_fee',
    method: 'post',
    data: query
  })
} */
export const changeSw = query => {
  return request({
    url: './bankendapi?method=ex_feeSetRate',
    method: 'post',
    data: query
  })
}
export const createCharge = query => {
  // console.log('create')
  return request({
    url: './bankendapi?method=ex_feeSetRate',
    method: 'post',
    data: query
  })
}

export const editchargedata = query => {
  return request({
    url: './bankendapi?method=ex_feeSetRate',
    method: 'post',
    data: query
  })
}

export const login = query => {
  // console.log('create')
  return request({
    url: './bankendapi?method=login',
    method: 'post',
    data: query
  })
}

// export const fetchData = query => {
//   return request({
//     url: './table.json',
//     method: 'get',
//     params: query
//   })
// }
