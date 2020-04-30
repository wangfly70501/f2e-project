<template>
  <div>
    <TopBreadcrumb :titles="['項目管理', '定投管理']"></TopBreadcrumb>

    <el-card>
      <el-button type="primary" @click="addDialogVisible = true" class="btn_right">建立定投</el-button>

      <!-- 列表 -->
      <el-table :data="stakinglist">
        <el-table-column label="ID" prop="id" width="50%"  align="center">
        </el-table-column>
        <el-table-column label="顯示"  align="center" width="100%">
          <template slot-scope="scope">
              <div v-if="scope.row.show_status===0" style="color:#AAAAAA"> <font-awesome-icon  icon="ban" size="lg" /> </div>
              <!--  <div v-else-if="scope.row.show_status===1" style="color:#79BB13"> <font-awesome-icon icon="check-circle" size="lg" /> </div> -->
              <div v-else style="color:#79BB13"> <font-awesome-icon icon="check-circle"  size="lg"/> </div>
          </template>
        </el-table-column>
        <el-table-column label="定投名稱"  align="center" width="100%" prop="title_GR">
        </el-table-column>
        <el-table-column label="from幣種"  align="center" width="100%" >
          <template slot-scope="scope">
            <div
              v-for="item in currencyList"
              :key="item.id"
              :label="item.currency"
              :value="item.id"
            >
            <div v-if="item.id==scope.row.currency_basic"   class="coinpadding">{{item.currency}}</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="to幣種" >
          <template slot-scope="scope">
            <div
              v-for="item in currencyList"
              :key="item.id"
              :label="item.currency"
              :value="item.id"
            >
            <div v-if="item.id==scope.row.currency_purchase"   class="coinpadding">{{item.currency}}</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="定投日期"  style="background-color:#FFFFF1"  prop="purchase_day">
          <template slot-scope="scope">
            <div
              v-for="item in currencyList"
              :key="item.id"
              :label="item.currency"
              :value="item.id"
            >
            <div>{{scope.row.purchase_day}}</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="成交手續費" prop="rate_deal" width="100%">
          <template slot-scope="scope">
          {{scope.row.rate_deal}} %
            </template>
        </el-table-column>
        <el-table-column label="代買手續費"  align="center" prop="rate_purchase">
          <template slot-scope="scope">
          {{scope.row.rate_purchase}} %
          </template>
        </el-table-column>
        <el-table-column label="躉繳優惠" prop="sp_rate">
          <template slot-scope="scope">
           {{scope.row.sp_rate}} %
          </template>
        </el-table-column>
        <el-table-column label="開放期限">
          <template slot-scope="scope">
            <div>{{scope.row.sp_starttime}}</div>~
            <div>{{scope.row.sp_endtime}}</div>
          </template>
        </el-table-column>
        <el-table-column label="人數上限">
          <template slot-scope="scope">
           {{scope.row.people_limit}} 人
          </template>
        </el-table-column>
        <el-table-column label="認購名單">
          <template slot-scope="scope">
            <el-button type="success"  plain size="mini" @click="joinPeopleVisible = true">{{scope.row.joinpeople}}</el-button>
          </template>
        </el-table-column>
        <el-table-column label="餘額不足">
          <template slot-scope="scope">
            <el-button type="success"  plain size="mini" @click="balanceVisible = true">{{scope.row.balance}}</el-button>
          </template>
        </el-table-column>
        <el-table-column label="">
          <el-button class="el-icon-edit" plain size="mini" @click="addDialogVisible = true"></el-button>
        </el-table-column>
      </el-table>

      <!-- 分页组件 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[10,20,50]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>

  <!-- 建立定投 -->
    <el-dialog title="建立定投" :visible.sync="addDialogVisible" width="50%" >
      <el-form :model="addForm" ref="addFormRef" label-width="130px">

        <el-form-item label="前台顯示" prop="addCharge">
          <el-switch v-model="addForm.addtxtrate"></el-switch>
        </el-form-item>

        <el-form-item label="名稱(繁)" prop="addCharge">
          <el-input v-model="addForm.addCharge"></el-input>
        </el-form-item>

        <el-form-item label="名稱(簡)" prop="addCharge">
          <el-input v-model="addForm.addtxtrate"></el-input>
        </el-form-item>

        <el-form-item label="名稱(英)" prop="addCharge">
          <el-input v-model="addForm.addtxtrate"></el-input>
        </el-form-item>
<hr class="hr-style1">
<br>
        <el-form-item label="幣種from" prop="addCharge">
          <el-select v-model="addForm.addtxtrate" placeholder="請選擇幣種">
            <el-option label="USDT" value="USDT"></el-option>
            <el-option label="TWD" value="TWD"></el-option>
        </el-select>
        </el-form-item>
        <el-form-item label="幣種to" prop="addCharge">
          <el-select v-model="addForm.addtxtrate" placeholder="請選擇幣種">
            <el-option label="BTC" value="BTC"></el-option>
        </el-select>
        </el-form-item>
        <el-form-item label="最低認購" prop="addCharge">
          <el-input v-model="addForm.addtxtrate"></el-input>
        </el-form-item>
        <el-form-item label="定投日期" prop="addCharge">
        <div class="orange-text">每月6日、16日、26日 早上10:00</div>
        </el-form-item>
        <el-form-item label="成交手續費" prop="addCharge">
        <div class="orange-text">0.1%</div>
        </el-form-item>
        <el-form-item label="代買手續費" prop="addCharge">
          <el-input v-model="addForm.addtxtrate"></el-input>％
        </el-form-item>
<hr class="hr-style1">
<div class="subtitle">躉繳</div>
        <el-form-item label="躉繳違約手續費" prop="addCharge">
          <el-input v-model="addForm.addtxtrate"></el-input>％（從剩餘期數金額中扣除）
        </el-form-item>
        <el-form-item label="躉繳優惠" prop="addCharge">
          <el-input v-model="addForm.addtxtrate"></el-input>%
        </el-form-item>
        <el-form-item label="躉繳優惠期間" prop="addCharge">
          <el-date-picker
            v-model="addForm.addtxtrate"
            type="daterange"
            range-separator="至"
            start-placeholder="開始日期"
            end-placeholder="結束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="躉繳優惠人數上限" prop="addCharge">
          <el-input v-model="addForm.addtxtrate"></el-input>人
        </el-form-item>
      </el-form>
      <!-- 底部區域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="fixedInvestment">儲 存</el-button>
      </span>
    </el-dialog>

    <!-- 認購名單 -->
    <el-dialog title="認購用戶名單" :visible.sync="joinPeopleVisible" width="80%" >
        <div>定投名稱：BTC定投</div>
        <el-table :data="stakinglist">
          <el-table-column label="UIUD" prop="id" width="50%"  align="center"></el-table-column>
          <el-table-column label="定投金額"  align="center" width="100%" prop="staking_amount"></el-table-column>
          <el-table-column label="定投日期"  style="background-color:#FFFFF1" >
            <template slot-scope="scope">
              <div>{{scope.row.cdate}}</div>
            </template>
          </el-table-column>
          <el-table-column label="認購日期"  style="background-color:#FFFFF1" >
            <template slot-scope="scope">
              <div>{{scope.row.cdate}}</div>
            </template>
          </el-table-column>
          <el-table-column label="退出日期"  style="background-color:#FFFFF1" >
            <template slot-scope="scope">
              <div>{{scope.row.cdate}}</div>
            </template>
          </el-table-column>
          <el-table-column label="退出原因"  style="background-color:#FFFFF1" >
            <template slot-scope="scope">
              <div>{{scope.row.cdate}}</div>
            </template>
          </el-table-column>
        </el-table>
    </el-dialog>

    <!-- 餘額不足 -->
    <el-dialog title="餘額不足名單" :visible.sync="balanceVisible" width="80%" >
        <div>定投名稱：BTC定投</div>
        <div>報表產製：2020/05/06 10:00</div>
        <div>定投時間：每月6日 10:00</div>
        <el-table :data="stakinglist">
          <el-table-column label="UIUD" prop="id" width="50%"  align="center"></el-table-column>
          <el-table-column label="認購日期"  style="background-color:#FFFFF1" >
            <template slot-scope="scope">
              <div>{{scope.row.cdate}}</div>
            </template>
          </el-table-column>
          <el-table-column label="定投金額"  style="background-color:#FFFFF1" >
            <template slot-scope="scope">
              <div>{{scope.row.cdate}}</div>
            </template>
          </el-table-column>
          <el-table-column label="可用餘額"  style="background-color:#FFFFF1" >
            <template slot-scope="scope">
              <div>{{scope.row.cdate}}</div>
            </template>
          </el-table-column>
          <el-table-column label="手機號碼"  style="background-color:#FFFFF1" >
            <template slot-scope="scope">
              <div>{{scope.row.cdate}}</div>
            </template>
          </el-table-column>
          <el-table-column label="電子信箱"  style="background-color:#FFFFF1" >
            <template slot-scope="scope">
              <div>{{scope.row.cdate}}</div>
            </template>
          </el-table-column>
        </el-table>
    </el-dialog>

    </el-card>
  </div>
</template>

<script>
import {
  currencyList,

  // info_behavior,
  createCharge,
  getStakingList
} from '../../api/index.js'

export default {
  data () {
    return {
      StakingmemList: '',
      showValue: '2',
      StakingMemberList: [],
      people_limit: '',
      endTime: '',
      queryData: {},
      content: '',
      searchlist: '',
      currencyList: [],
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10,
        enable: '',
        beginTime: '',
        endTime: ''
      },
      date: [],
      stakinglist: [

      ],
      actypelist: [],
      total: 0,
      addDialogVisible: false,
      joinPeopleVisible: false,
      balanceVisible: false,
      addForm: {},
      editDialogVisible: false,
      table: {},
      editForm: {
        startTime: '',
        lang: [],
        beginTime: []
      },
      startTime: '',
      lastTime: '',
      enable: [
        /*     {
          label: '所有',
          value: ''
        }, */
        {
          label: '人數限制',
          value: '1'
        },
        {
          label: '時間限制',
          value: '2'
        },
        {
          label: '活動常駐',
          value: '3'
        }
      ],
      showstatus: [
        {
          label: '請選擇',
          value: '2'
        },
        {
          label: '顯示',
          value: '1'
        },
        {
          label: '不顯示',
          value: '0'
        }
      ]
    }
  },
  /*   components: {
    savesort
  }, */
  Filter: {
    commaFormat: function (value) {
      // 加上千分位符號
      return value
        .toString()
        .replace(/^(-?\d+?)((?:\d{3})+)(?=\.\d+$|$)/, function (
          all,
          pre,
          groupOf3Digital
        ) {
          return pre + groupOf3Digital.replace(/\d{3}/g, ',$&')
        })
    }
  },
  watch: {
    startTime (newData, oldData) {
      if (newData.id === oldData.id) return
      this.$refs.audio.play()
    },
    lastTime (newData, oldData) {
      if (newData.id === oldData.id) return
      this.$refs.audio.play()
    }

  },

  created () {
    this.getStakingList()
    this.getCurrencyList()

    this.objList()
  },

  methods: {
    objList () {
      this.objname = localStorage.getItem('mg_name')
      this.objpwd = localStorage.getItem('mg_pwd')
      console.log(typeof this.objname, this.objpwd)

      if (this.objname == null || this.objpwd == null) {
        console.log('15132321')
        this.$router.push('/login')
      }
    },
    async getCurrencyList () {
      let data = {
        mg_name: localStorage.getItem('mg_name'),
        mg_pwd: localStorage.getItem('mg_pwd'),
        mg_state: localStorage.getItem('mg_state')
      }
      await currencyList(data).then(res => {
        this.currencyList = res.data
        console.log('currencyList', this.currencyList)
      })
    },
    // 獲取列表
    async getStakingList () {
      let data = {
        mg_name: localStorage.getItem('mg_name'),
        mg_pwd: localStorage.getItem('mg_pwd'),
        mg_state: localStorage.getItem('mg_state'),
        paginate: this.queryInfo.pagesize,
        page: this.queryInfo.pagenum,
        show_status: this.showValue.toString()
      }

      await getStakingList(data).then(res => {
        this.stakinglist = res.data
        this.total = res.pagination.total_record
        console.log('stakinglist', this.stakinglist)
      })
    },

    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.queryInfo.pagenum = 1
      this.getactivitylist()
    },

    handleCurrentChange (newPage) {
      this.queryInfo.pagenum = newPage
      this.getactivitylist()
    },

    async Search () {
      this.queryInfo.pagenum = 1
      this.getactivitylist()
    },

    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    async clear () {
      this.searchlist = ''
      this.showValue = '2'
      this.enable.value = ''
      /* this.queryInfo.date = '' */
      this.getactivitylist()
    },
    jump (index, row) {
      let queryData = {}
      queryData = row
      this.$router.push({ path: '/activitymem', query: queryData })
    },
    async fixedInvestment () {
      this.addDialogVisible = false
      this.joinPeopleVisible = false
      this.balanceVisible = false
      var data = {
        mg_name: localStorage.getItem('mg_name'),
        mg_pwd: localStorage.getItem('mg_pwd'),
        mg_state: localStorage.getItem('mg_state'),
        bank_en: this.addForm.addbank,
        rate: this.addForm.addCharge,
        txt_rate: this.addForm.addtxtrate
      }
      await createCharge(data).then(res => {
        if (res.error_code === 0) {
          this.$message.success('新增成功')
        } else {
          this.$message.error('此銀行新增過了，請使用編輯修改')
        }
        this.getChargeList()
      })
    }
    // addDialogClosed () {
    //   this.$refs.addFormRef.resetFields()
    //   this.addForm.addtxtrate = ''
    // },
    // joinPeopleClosed () {
    //   this.$refs.addFormRef.resetFields()
    //   this.addForm.addtxtrate = ''
    // },
    // balanceClosed () {
    //   console.log(this.$refs.addFormRef)
    //   this.$refs.addFormRef.resetFields()
    //   this.addForm.addtxtrate = ''
    // }
  }
}
/* 數字千分位 */
</script>

<style>
.form-right {
  width: 50%;
  padding-left: 1rem;
  padding-right: 1rem;
  padding-top: 1rem;
}
.btn_right {
  float: right;
  left: 50px;
}
input::-webkit-input-placeholder {
  /* placeholder颜色  */
  color: #aab2bd;
  /* placeholder字体大小  */
  font-size: 12px;
}
.coinpadding{
  margin: 10px;
}

.hr-style1{
    border: 0;
    height: 1px;
    background: #333;
    background-image: linear-gradient(to right, rgb(247, 162, 162), rgb(248, 218, 119), rgb(247, 162, 162));
    margin:10px;
}

.subtitle{
  text-align:center;
  color:#E67C4B;
  font-size:22px;
  font-weight:400;
  padding:20px;
}

.orange-text{
  color:#E67C4B;
  font-weight:600;
}

</style>
