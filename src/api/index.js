import request from '../utils/request'

// 會員列表

export const userData = query => {
  return request({
    url: './bankendapi?method=getMemberList',
    method: 'post',
    data: query
  })
}

// 黑名單會員列表

export const blackmemData = query => {
  return request({
    url: './bankendapi?method=getBMemberList',
    method: 'post',
    data: query
  })
}
// 會員層級列表
export const userlevelData = query => {
  return request({
    url: './bankendapi?method=getLevelList',
    method: 'post',
    data: query
  })
}

// 會員層級列表設置
export const userlevelSet = query => {
  return request({
    url: './bankendapi?method=setLevel',
    method: 'post',
    data: query
  })
}
// 會員層級列新增
export const adduserlevel = query => {
  return request({
    url: './bankendapi?method=setLevel',
    method: 'post',
    data: query
  })
}
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
    url: './bankendapi?method=ex_feeAdd',
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
// 登入
export const login = query => {
  // console.log('create')
  return request({
    url: './bankendapi?method=login',
    method: 'post',
    data: query
  })
}
// 註冊
export const signup = query => {
  return request({
    url: './bankendapi?method=mgregister',
    method: 'post',
    data: query
  })
}
// 忘記密碼
export const forgetpsw = query => {
  return request({
    url: './bankendapi?method=pwdForget',
    method: 'post',
    data: query
  })
}
// 重設密碼
export const resetpsw = query => {
  return request({
    url: './bankendapi?method=resetPwd',
    method: 'post',
    data: query
  })
}
// 手續費的銀行add
export const chargebankList = query => {
  return request({
    url: './bankendapi?method=ex_feeSetBankList',
    method: 'post',
    data: query
  })
}

// 銀行設置
export const bankdata = query => {
  return request({
    url: './bankendapi?method=getBankList',
    method: 'post',
    data: query
  })
}

export const createBank = query => {
  return request({
    url: './bankendapi?method=addBank',
    method: 'post',
    data: query
  })
}

export const editbankData = query => {
  return request({
    url: './bankendapi?method=setBank',
    method: 'post',
    data: query
  })
}

// 營收報表
export const revenuedata = query => {
  return request({
    url: './bankendapi?method=getRevenueStatement',
    method: 'post',
    data: query
  })
}
// 交易報表
export const transactiondata = query => {
  return request({
    url: './bankendapi?method=getTransactionReport',
    method: 'post',
    data: query
  })
}
// faq列表
export const faqdata = query => {
  return request({
    url: './bankendapi?method=getFaqList',
    method: 'post',
    data: query
  })
}
// faq新增
export const faqadd = query => {
  return request({
    url: './bankendapi?method=addFaq',
    method: 'post',
    data: query
  })
}
// faq修改
export const faqedit = query => {
  return request({
    url: './bankendapi?method=setFaq',
    method: 'post',
    data: query
  })
}
// 實名認證

export const KycList = query => {
  return request({
    url: './bankendapi?method=getKycList',
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
