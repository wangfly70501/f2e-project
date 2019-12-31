import request from '../utils/request';


//帳號綁定
export const create = query => {
    // console.log('create')
    return request({
        url: './postapi?method=create',
        method: 'post',
        data: query
    })
}

//刪除綁定
export const del_detail = query => {
    // console.log('del_detail')
    return request({
        url: './postapi?method=del_detail',
        method: 'post',
        data: query
    })
}

//銀行綁定紀錄
export const player_list = query => {
    
    return request({
        url: './postapi?method=player_list',
        method: 'post',
        data: query
    })
}

// 銀行綁定 下拉式第一層
export const bank_drop_down_menu = query => {
    // console.log('bank_drop_down_menu')
    return request({
        url: './postapi?method=bank_drop_down_menu',
        method: 'post',
        data: query
    })
}

// 銀行綁定 下拉第二層
export const bank_drop_down_menu_2nd = query => {
    // console.log('bank_drop_down_menu_2nd')
    return request({
        url: './postapi?method=bank_drop_down_menu_2nd',
        method: 'post',
        data: query
    })
}

//帳戶資料
export const getdetail = query => {
    // console.log('detail')
    return request({
        url: './postapi?method=detail',
        method: 'post',
        data: query
    })
}

//入金紀錄
export const dw_list = query => {
    // console.log('dw_list')
    return request({
        url: './postapi?method=dw_list',
        method: 'post',
        data: query
    })
}


//入金
export const deposit = query => {
    return request({
        url: './postapi?method=deposit',
        method: 'post',
        data: query
    })
}

//出金限制
export const limit_amt = query => {
    return request({
        url: './postapi?method=limit_amt',
        method: 'post',
        data: query
    })
}
//出金
export const withdraw = query => {
    return request({
        url: './postapi?method=withdraw',
        method: 'post',
        data: query
    })
}



//出入金紀錄
export const dwa_list = query => {
    return request({
        url: './postapi?method=dwa_list',
        method: 'post',
        data: query
    })
}


//取消出金
export const w_Status = query => {
    return request({
        url: './postapi?method=w_Status',
        method: 'post',
        data: query
    });
}


export const fetchData = query => {
    return request({
        url: './table.json',
        method: 'get',
        params: query
    });
};

