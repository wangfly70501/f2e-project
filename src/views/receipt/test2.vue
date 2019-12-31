
<template>
<div>
<el-input v-model="tableDataName" placeholder="請輸入姓名" style="width:240px"></el-input>
<el-button type="primary" @click="doFilter">搜尋</el-button>
<el-button type="primary" @click="openData">展示資料</el-button>
<el-table
:data="tableDataEnd"
border
style="width: 100%">
<el-table-column
prop="date"
label="日期"
width="180">
</el-table-column>
<el-table-column
prop="name"
label="姓名"
width="180">
</el-table-column>
<el-table-column
prop="address"
label="地址">
</el-table-column>
</el-table>
<el-pagination
@size-change="handleSizeChange"
@current-change="handleCurrentChange"
:current-page="currentPage"
:page-sizes="[1, 2, 3, 4]"
:page-size="pageSize"
layout="total, sizes, prev, pager, next, jumper"
:total="totalItems">
</el-pagination>
</div>
</template>
<script>
export default {
  data () {
    return {
      tableDataBegin: [
        {
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀區金沙江路 1518 弄'
        },
        {
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀區金沙江路 1517 弄'
        },
        {
          date: '2016-05-03',
          name: '王二虎',
          address: '上海市普陀區金沙江路 1519 弄'
        },
        {
          date: '2016-05-04',
          name: '王二虎',
          address: '上海市普陀區金沙江路 1516 弄'
        },
        {
          date: '2016-05-05',
          name: '王三虎',
          address: '上海市普陀區金沙江路 1518 弄'
        },
        {
          date: '2016-05-06',
          name: '王三虎',
          address: '上海市普陀區金沙江路 1517 弄'
        },
        {
          date: '2016-05-07',
          name: '王小虎',
          address: '上海市普陀區金沙江路 1519 弄'
        },
        {
          date: '2016-05-08',
          name: '王小虎',
          address: '上海市普陀區金沙江路 1516 弄'
        }
      ],
      tableDataName: '',
      tableDataEnd: [],
      currentPage: 4,
      pageSize: 2,
      totalItems: 0,
      filterTableDataEnd: [],
      flag: false
    }
  },
  created () {
    this.totalItems = this.tableDataBegin.length
    if (this.totalItems > this.pageSize) {
      for (let index = 0; index < this.pageSize; index) {
        this.tableDataEnd.push(this.tableDataBegin[index])
      }
    } else {
      this.tableDataEnd = this.tableDataBegin
    }
  },
  methods: {
    // 前端搜尋功能需要區分是否檢索,因為對應的欄位的索引不同
    // 用兩個變數接收currentChangePage函式的引數
    doFilter () {
      if (this.tableDataName === '') {
        this.$message.warning('查詢條件不能為空！')
        return
      }
      this.tableDataEnd = []
      // 每次手動將資料置空,因為會出現多次點選搜尋情況
      this.filterTableDataEnd = []
      this.tableDataBegin.forEach((value, index) => {
        if (value.name) {
          if (value.name.indexOf(this.tableDataName) >= 0) {
            this.filterTableDataEnd.push(value)
          }
        }
      })
      // 頁面資料改變重新統計資料數量和當前頁
      this.currentPage = 1
      this.totalItems = this.filterTableDataEnd.length
      // 渲染表格,根據值
      this.currentChangePage(this.filterTableDataEnd)
      // 頁面初始化資料需要判斷是否檢索過
      this.flag = true
    },
    openData () {},
    handleSizeChange (val) {
      console.log(`每頁 ${val} 條`)
      this.pageSize = val
      this.handleCurrentChange(this.currentPage)
    },
    handleCurrentChange (val) {
      console.log(`當前頁: ${val}`)
      this.currentPage = val
      // 需要判斷是否檢索
      if (!this.flag) {
        this.currentChangePage(this.tableDataEnd)
      } else {
        this.currentChangePage(this.filterTableDataEnd)
      }
    }, // 元件自帶監控當前頁碼
    currentChangePage (list) {
      let from = (this.currentPage - 1) * this.pageSize
      let to = this.currentPage * this.pageSize
      this.tableDataEnd = []
      for (; from < to; from) {
        if (list[from]) {
          this.tableDataEnd.push(list[from])
        }
      }
    }
  }
}
</script>
