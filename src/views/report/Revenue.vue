<template>
  <div>
    <TopBreadcrumb :titles="['報表', '營收報表']"></TopBreadcrumb>

    <el-card>
      <!-- 搜尋工具 -->

      <el-date-picker
        type="month"
        placeholder="選擇日期"
        v-model="queryInfo.date"
        value-format="yyyy-MM"
        style="width:30% "
      ></el-date-picker>&nbsp;
      <el-select v-model="queryInfo.enable" placeholder="請選擇">
        <el-option v-for="item in enable" :key="item.id" :label="item.label" :value="item.value"></el-option>
      </el-select>

      <el-button type="primary" @click="Search">搜尋</el-button>
      <el-button type="primary" @click="ExportSavePdf()">匯出</el-button>
      <el-button type="primary" @click="downExcel()">匯出excel</el-button>
      <!-- 列表数据 -->
      <div ref="pdfContent" id="pdfContent">
        <div class="font">
          <span v-if="this.queryInfo.enable === '0'">營收報表-入金</span>
          <span v-else>營收報表-出金</span>
        </div>
        <el-table :data="revenueList" border stripe>
           <el-table-column label="UID" prop="uuid"></el-table-column>
          <el-table-column label="會員帳號" prop="account"></el-table-column>
          <el-table-column label="身分證" prop="identityid"></el-table-column>
          <el-table-column label="交易次數" prop="transactionTimes"></el-table-column>
          <el-table-column label="交易總金額" prop="transactionTotal"></el-table-column>

        </el-table>
      </div>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 15]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
  </div>
</template>

<script>
import { revenuedata } from '../../api/index.js'
import moment from 'moment'

export default {
  data () {
    return {
      queryInfo: {
        pagenum: 1,
        pagesize: 10,
        date: [],
        enable: '0'
      },
      revenueList: [],
      total: 0,
      isDisabl: true,
      userList: [],
      addressVisible: false,
      nowTime: moment(new Date()).format('YYYY-MM'),
      enable: [
        {
          label: '入金',
          value: '0'
        },
        {
          label: '出金',
          value: '1'
        }
      ]
    }
  },

  created () {
    this.getRevenueList()
  },

  methods: {
    async getRevenueList () {
      this.queryInfo.date = this.nowTime
      let data = {
        mg_name: localStorage.getItem('mg_name'),
        mg_pwd: localStorage.getItem('mg_pwd'),
        mg_state: localStorage.getItem('mg_state'),
        paginate: this.queryInfo.pagesize,
        page: this.queryInfo.pagenum,
        searchMonth: this.queryInfo.date,
        opcode: this.queryInfo.enable
      }
      console.log(this.queryInfo.date)
      await revenuedata(data).then(res => {
        this.revenueList = res.data
        this.total = res.pagination.total_record
      })
    },
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.getRevenueList()
    },
    handleCurrentChange (newPage) {
      this.queryInfo.pagenum = newPage
      this.getRevenueList()
    },
    async Search () {
      console.log()
      this.queryInfo.pagenum = 1
      await this.getRevenueList()
    },
    async Exportfile () {
      console.log()
      this.queryInfo.pagenum = 1
      await this.getRevenueList()
    },
    async  downExcel () {
      const th = ['UID', '會員帳號', '身分證', '交易次數', '交易總金額']
      const filterVal = ['uuid', 'account', 'identityid', 'transactionTimes', 'transactionTotal']
      const data = this.revenueList.map(v => filterVal.map(k => v[k]))
      const [fileName, fileType, sheetName] = ['測試下載', 'xlsx', '測試頁']
      this.$toExcel({ th, data, fileName, fileType, sheetName })
    }
  }
}
</script>

<style lang="less" scoped>
.el-cascader {
  width: 100%;
}
.font {
  font-family: "Noto Sans TC", sans-serif;
  margin: 10px 0;
}
</style>
