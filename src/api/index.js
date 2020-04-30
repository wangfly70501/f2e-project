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
// faq img
export const faqimg = query => {
  return request({
    url: './bankendapi?method=faqTest',
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
// faq列表
export const faqimglist = query => {
  return request({
    url: './bankendapi?method=getFaqPicList',
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

// 實名驗證
export const getKYCcertificateBumber = query => {
  return request({
    url: './bankendapi?method=getKYCcertificateBumber',
    method: 'post',
    data: query
  })
}
// 實名認證通過
export const KycSuccess = query => {
  return request({
    url: './bankendapi?method=setKycSuccess',
    method: 'post',
    data: query
  })
}
// 實名認證失敗
export const KycFail = query => {
  return request({
    url: './bankendapi?method=setKycFail',
    method: 'post',
    data: query
  })
}
// 鎖倉列表
export const Lockupdata = query => {
  return request({
    url: './bankendapi?method=getActivityList',
    method: 'post',
    data: query
  })
}

// 鎖倉編輯
export const Lockupedit = query => {
  return request({
    url: './bankendapi?method=setActivity',
    method: 'post',
    data: query
  })
}
// 新增鎖倉
export const addActivity = query => {
  return request({
    url: './bankendapi?method=addActivity',
    method: 'post',
    data: query
  })
}
// 鎖倉參加者
export const getActivityJoin = query => {
  return request({
    url: './bankendapi?method=getActivityJoin',
    method: 'post',
    data: query
  })
}

// CMS系統
export const getcmslist = query => {
  return request({
    url: './bankendapi?method=cmsList',
    method: 'post',
    data: query
  })
}
// 新增列表
export const uploadban = query => {
  return request({
    url: './bankendapi?method=cmsUpload64',
    method: 'post',
    data: query
  })
}
// 新增列表
export const uploadban1 = query => {
  return request({
    url: './bankendapi?method=cmsUpload',
    method: 'post',
    data: query
  })
}
// 修改廣告
export const editban = query => {
  return request({
    url: './bankendapi?method=cmsSet',
    method: 'post',
    data: query
  })
}
// 刪除廣告
export const delban = query => {
  return request({
    url: './bankendapi?method=cmsDelete',
    method: 'post',
    data: query
  })
}

/// ///幣種/////
export const currencyList = query => {
  return request({
    url: './bankendapi?method=getCurrencyList',
    method: 'post',
    data: query
  })
}
/// ///維護頁面/////
export const maintainList = query => {
  return request({
    url: './bankendapi?method=notice_list',
    method: 'post',
    data: query
  })
}
/// ///維護頁面修改/////
export const maintainedit = query => {
  return request({
    url: './bankendapi?method=notice_config',
    method: 'post',
    data: query
  })
}
/// 審核提領上限列表//
export const withdrawlimit = query => {
  return request({
    url: './bankendapi?method=getMemberLvList',
    method: 'post',
    data: query
  })
}
/// 審核提領上限//
export const reviwlimit = query => {
  return request({
    url: './bankendapi?method=verifyMemberLv',
    method: 'post',
    data: query
  })
}
// 會員詳細列表//
export const memberDetail = query => {
  return request({
    url: './bankendapi?method=getMemberDetail',
    method: 'post',
    data: query
  })
}
// 會員帳號設置//
export const setMemberBlack = query => {
  return request({
    url: './bankendapi?method=setMemberBlack',
    method: 'post',
    data: query
  })
}

// 申請提領上限//
export const setMemberLv = query => {
  return request({
    url: './bankendapi?method=setMemberLv',
    method: 'post',
    data: query
  })
}

// 活動管理列表//
export const info_task = query => {
  return request({
    url: './taskapi?method=info_task',
    method: 'post',
    data: query
  })
}
// 活動類型列表//
export const info_behavior = query => {
  return request({
    url: './taskapi?method=info_behavior',
    method: 'post',
    data: query
  })
}
// 新增活動//
export const inserttask = query => {
  return request({
    url: './taskapi?method=insert_task',
    method: 'post',
    data: query
  })
}
// 活動結束時間//
export const checkBehaviorEndTime = query => {
  return request({
    url: './taskapi?method=checkBehaviorEndTime',
    method: 'post',
    data: query
  })
}
// 活動編輯//
export const setBehavior = query => {
  return request({
    url: './taskapi?method=setBehavior',
    method: 'post',
    data: query
  })
}
// 活動類型//
export const get_drop_down_behavior = query => {
  return request({
    url: './taskapi?method=get_drop_down_behavior',
    method: 'post',
    data: query
  })
}
// 活動參加人數//
export const getBehaviorJoin = query => {
  return request({
    url: './taskapi?method=getBehaviorJoin',
    method: 'post',
    data: query
  })
}
// json//
/* export const userdata = query => {
  return request({
    url: './table.json',
    method: 'get',
    params: query
  })
} */

// 權限列表//
export const getAuthList = query => {
  return request({
    url: './bankendapi?method=getAuthList',
    method: 'post',
    data: query
  })
}

// 更改權限//
export const setMgState = query => {
  return request({
    url: './bankendapi?method=setMgState',
    method: 'post',
    data: query
  })
}

// 取得會員權限列表
export const getRolePermissions = query => {
  return request({
    url: './taskapi?method=getRoleComponent',
    method: 'post',
    data: query
  })
}

// 角色列表
export const roleList = query => {
  return request({
    url: './taskapi?method=roleList',
    method: 'post',
    data: query
  })
}

// 新增角色
export const roleAdd = query => {
  return request({
    url: './taskapi?method=roleAdd',
    method: 'post',
    data: query
  })
}

// 分配權限
export const rolePermissionAdd = query => {
  return request({
    url: './taskapi?method=rolePermissionAdd',
    method: 'post',
    data: query
  })
}

// 編輯
export const roleModify = query => {
  return request({
    url: './taskapi?method=roleModify',
    method: 'post',
    data: query
  })
}

// 使用者列表(角色)
export const roleStatus = query => {
  return request({
    url: './taskapi?method=roleStatus',
    method: 'post',
    data: query
  })
}

// 權限列表
export const rolePermissionList = query => {
  return request({
    url: './taskapi?method=rolePermissionList',
    method: 'post',
    data: query
  })
}

// 權限列表狀態
export const rolePermissionStatus = query => {
  return request({
    url: './taskapi?method=rolePermissionStatus',
    method: 'post',
    data: query
  })
}
// 定投列表//
export const getStakingList = query => {
  return request({
    url: './taskapi?method=getStakingList',
    method: 'post',
    data: query
  })
}
// 參加定投會員列表//
export const getStakingMemberList = query => {
  return request({
    url: './taskapi?method=getStakingMemberList',
    method: 'post',
    data: query
  })
}
// 餘額不足會員列表//
export const getStakingBalanceLackList = query => {
  return request({
    url: './taskapi?method=getStakingBalanceLackList',
    method: 'post',
    data: query
  })
}

// 使用者分配角色
export const updateManagerRole = query => {
  return request({
    url: './taskapi?method=updateManagerRole',
    method: 'post',
    data: query
  })
}
