<template>
  <div>
    <TopBreadcrumb :titles="['報表', '交易報表']"></TopBreadcrumb>

    <el-card>
      <!-- 搜尋工具 -->

      <el-date-picker
        type="daterange"
        start-placeholder="StartTime"
        end-placeholder="EndTime"
        v-model="queryInfo.date"
        value-format="yyyy-MM-dd"
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
          <span v-if="this.queryInfo.enable === '0'">交易報表-入金</span>
          <span v-else>交易報表-出金</span>
        </div>
        <el-table :data="transactionList" border stripe>
          <el-table-column label="UID" prop="uuid"></el-table-column>
          <el-table-column label="會員帳號" prop="account"></el-table-column>
          <el-table-column label="身分證" prop="identityid"></el-table-column>
           <el-table-column label="銀行卡號" prop="bankcard_uuid"></el-table-column>
           <el-table-column label="交易額" prop="quota_after"></el-table-column>
          <el-table-column label="交易日期" prop="txdate"></el-table-column>

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
import { transactiondata } from '../../api/index.js'
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
      transactionList: [],
      total: 0,
      isDisabl: true,
      userList: [],
      addressVisible: false,
      nowTime: moment(new Date()).format('YYYY-MM-DD'),
      nowTimeSubTract: moment(new Date())
        .subtract('7', 'days')
        .format('YYYY-MM-DD'),
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
    this.getTransactionList()
  },

  methods: {
    async getTransactionList () {
      this.queryInfo.date[1] = this.nowTime
      this.queryInfo.date[0] = this.nowTimeSubTract
      let data = {
        mg_name: localStorage.getItem('mg_name'),
        mg_pwd: localStorage.getItem('mg_pwd'),
        mg_state: localStorage.getItem('mg_state'),
        paginate: this.queryInfo.pagesize,
        page: this.queryInfo.pagenum,
        starttime: this.queryInfo.date[0],
        endtime: this.queryInfo.date[1],
        opcode: this.queryInfo.enable
      }

      await transactiondata(data).then(res => {
        this.transactionList = res.data
        this.total = res.pagination.total_record
      })
    },
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.getTransactionList()
    },
    handleCurrentChange (newPage) {
      this.queryInfo.pagenum = newPage
      this.getTransactionList()
    },
    async Search () {
      this.queryInfo.pagenum = 1
      let data = {
        mg_name: localStorage.getItem('mg_name'),
        mg_pwd: localStorage.getItem('mg_pwd'),
        mg_state: localStorage.getItem('mg_state'),
        paginate: this.queryInfo.pagesize,
        page: this.queryInfo.pagenum,
        starttime: this.queryInfo.date[0],
        endtime: this.queryInfo.date[1],
        opcode: this.queryInfo.enable
      }

      await transactiondata(data).then(res => {
        this.transactionList = res.data
        this.total = res.pagination.total_record
      })
    },
    async Exportfile () {
      this.queryInfo.pagenum = 1
      await this.getTransactionList()
    },
    async  downExcel () {
      const th = ['UID', '會員帳號', '身分證', '銀行卡號', '交易額', '交易日期']
      const filterVal = ['uuid', 'account', 'identityid', 'bankcard_uuid', 'quota_after', 'txdate']
      const data = this.transactionList.map(v => filterVal.map(k => v[k]))
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
