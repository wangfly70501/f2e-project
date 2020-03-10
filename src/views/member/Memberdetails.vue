<template>
  <el-card>
    <!--    <SearchTool v-model="queryInfo.query" placeholder="暫不支持搜索">
    </SearchTool>-->

    <!-- 會員詳細資料 -->
    <div>
      <p class="txt">
        會員資料

        <el-button
          icon="el-icon-edit"
          type="primary"
          size="mini"
          style="float:right"
          v-show="isShow"
          @click="showToggle"
        ></el-button>

        <el-button type="primary" size="mini" style="float:right" v-show="!isShow"  @click="acmange">儲存</el-button>
        <el-button
          type="primary"
          size="mini"
          style="float:right"
          @click="showToggle"
          v-show="!isShow"
          plain
        >取消</el-button>
            <el-tag v-if="userList.blacklist===0" type="success" style="float:right">帳號啟用中</el-tag>
         <el-tag v-else type="danger" style="float:right">帳號停用中</el-tag>
      </p>
      <!--         <template v-for="item in userList">
          <template v-if="item.status===0" >帳號停用中</template>
          <template v-else>帳號啟用中</template>
      </template>-->
    </div>

    <table class="tabletxt">
      <tr v-show="!isShow" style="background-color:#FFFF6F">
        <td>
          <p>帳號狀態：</p>
        </td>
        <td>
          <el-select v-model="enable.value" placeholder="請選擇狀態" style="width:40% ">
            <el-option
              v-for="(enableValue,index) in enable"
              :key="index"
              v-bind:label="enableValue.label"
              v-bind:value="enableValue.value"
            >{{enableValue.label}}</el-option>
          </el-select>&nbsp;
        </td>
      </tr>
      <tr>
        <td>
          <p>UUID:</p>
        </td>
        <td>{{userList.uuid}}</td>
      </tr>
      <tr>
        <td>
          <p>安全等級:</p>
        </td>
        <td>LV{{userList.securityLevel}}</td>
      </tr>
      <tr>
        <td>
          <p>台幣資產:</p>
        </td>
        <td>{{userList.amount |NumFormat}} TWD</td>
      </tr>
      <tr>
        <td>
          <p>EMAIL:</p>
          <p>手機:</p>
        </td>

        <td>
          <p>{{userList.email}}</p>
          <p v-if="userList.mobile===''" class="unbindtxt">(尚未綁定)</p>
          <p v-else>{{userList.mobile}}</p>
        </td>
      </tr>
      <tr>
        <td>
          <p>會員姓名:</p>
          <p>身分證字號:</p>
        </td>

        <td>
           <p v-if="userList.username===''" class="unbindtxt">(尚未實名驗證)</p>
          <p v-else>{{userList.username}}</p>
           <p v-if="userList.identityid===''" class="unbindtxt">(尚未實名驗證)</p>
          <p v-else>{{userList.identityid |phoneformat}}</p>
        </td>
      </tr>
      <tr>
        <td>
          <p>綁定銀行:</p>
         <!--  <p>銀行戶名:</p> -->
        </td>

        <td>
          <p v-if="userList.account===''" class="unbindtxt">(尚未綁定)</p>
          <p v-else>{{userList.account}}</p>
          <!--  <p v-if="userList.bankusrname===''" class="unbindtxt">(尚未綁定)</p>
          <p v-else>{{userList.bankusrname}}</p> -->
        </td>
      </tr>
    </table>
    <!-- 單日提領上限 -->
    <div>
      <p class="txt">
        單日提領上限
        <el-button
          icon="el-icon-edit"
          type="primary"
          size="mini"
          style="float:right"
          v-show="ssShow"
          @click="showlimit"
        ></el-button>

        <el-button type="primary" size="mini" style="float:right" v-show="!ssShow"  @click="wdlimitcap">儲存</el-button>
        <el-button
          type="primary"
          size="mini"
          style="float:right"
          @click="showlimit"
          v-show="!ssShow"
          plain
        >取消</el-button>
      </p>
    </div>
    <table class="tabletxt" style="background-color:#FFFF6F" v-show="!ssShow" >
      <!-- 隱藏顯示 -->
      <tr style="background-color:#FFFF6F">
        <td>
          <p>永久上限:</p>
        </td>
        <td>
          <template>
            <div v-if="userList.limitday!=100000" >{{userList.limitday |NumFormat}} (會員等級{{userList.level}})</div>
            <!--  <div v-else-if="userList.limitday='500000'" >{{userList.limitday |NumFormat}} (會員等級{{userList.level}})</div> -->
            <div v-else >
              <el-select v-model="awlist.level" placeholder="預設值" value-key="id">
                <el-option
                  v-for="(awlisttValue,index) in awlist"
                  :key="index"
                  :label="awlisttValue.label"
                  :value="awlisttValue.level"
                >{{awlisttValue.label }} </el-option>
              </el-select>
              <div style="color:red;font-size:10px">僅能設定一次，請謹慎確認</div>
            </div>
          </template>
        </td>
      </tr>
      <tr>
        <td>
          <p>臨時上限:</p>
        </td>
        <td>
          <template>
            <el-select v-model="temlist.level" placeholder="預設值" value-key="id">
              <el-option
                v-for="(temlistValue,index) in temlist"
                :key="index"
                v-bind:label="temlistValue.label"
                v-bind:value="temlistValue.level"
              >{{temlistValue.label }} </el-option>
            </el-select>
          </template>
        </td>
      </tr>
            <tr v-show="!ssShow" style="background-color:#FFFF6F">
        <td>
          <p>調整原因(*)</p>
        </td>
        <td>
             <el-input type="textarea" v-model="queryInfo.desc"  style="width:55%"></el-input>
<!--           <el-form :rules="rules" style="width:55%">
            <el-form-item prop="limit">

               </el-form-item>
            </el-form> -->
        </td>
      </tr>
      </table>
      <!-- 直接顯示 -->
       <table class="tabletxt"  v-show="ssShow">
      <tr>
        <td>
          <p>永久上限:</p>
        </td>
        <td>
          <p>
             <template >{{userList.limitday |NumFormat}} TWD(會員等級 {{userList.level }})</template>
          </p>
        </td>
      </tr>

      <tr>
        <td>
          <p>臨時上限:</p>
        </td>
        <td>
          <p>
            <template>
            <p v-if="userList.level==0" >未設定</p>
            <p v-else-if="userList.level==1" >未設定</p>
            <p v-else-if="userList.level==2" >未設定</p>
             <p v-else>{{userList.amount }}</p>
           </template>
          </p>
        </td>
      </tr>
    </table>
  </el-card>
</template>

<script>
import { memberDetail, setMemberBlack, setMemberLv } from '../../api/index.js'

export default {
  data () {
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10,
        desc: ''
      },
      orderList: [],
      total: 0,
      isDisabl: true,
      /*     userList: [
        {
          status: 1,
          uuid: '10080',
          username: '',
          identityid: 'B123456789',
          mobile: '0912345678',
          level: 1,
          amount: 10000000,
          lg_in_time: '2020-02-19 11:03',
          lg_out_time: '2020-02-19 11:03',
          email: 'wang777@gmail.com',
          bankacount: '',
          bank: '國泰世華',
          bankusrname: '',
          awlimit: ''
        }

      ], */
      userList: {
        limitday: {}
      },
      isShow: true,
      ssShow: true,
      addressVisible: false,
      enable: [
        {
          label: '帳號停用',
          value: 1
        },
        {
          label: '帳號啟用',
          value: 0
        }
      ],
      awlist: [
        {
          label: '300,000 TWD(會員等級1)',
          level: 1

        },
        {
          label: '500,000 TWD(會員等級2)',
          level: 2

        }
      ],
      temlist: [
        {
          label: '1000,000 TWD(會員等級3)',
          level: 3

        },
        {
          label: '1500,000 TWD(會員等級4)',
          level: 4

        },
        {
          label: '2000,000 TWD(會員等級5)',
          level: 5

        }
      ]

    }
  },

  created () {
    this.getmemdetailList()
    console.log('1223', this.$route.query.uuid)
  },

  methods: {
    async getmemdetailList () {
      let data = {
        mg_name: localStorage.getItem('mg_name'),
        mg_pwd: localStorage.getItem('mg_pwd'),
        mg_state: localStorage.getItem('mg_state'),
        uuid: this.$route.query.uuid
      }
      console.log('1323', data)
      await memberDetail(data).then(res => {
        this.userList = res.data
        console.log('1323', this.userList)
        console.log(typeof this.userList.limitday)
      })
    },

    showToggle () {
      this.isShow = !this.isShow
    },
    showlimit () {
      this.ssShow = !this.ssShow
    },
    handleCurrentChange (newPage) {
      this.queryInfo.pagenum = newPage
      this.getUserList()
    },
    acmange () {
      let data = {
        mg_name: localStorage.getItem('mg_name'),
        mg_pwd: localStorage.getItem('mg_pwd'),
        mg_state: localStorage.getItem('mg_state'),
        uuid: this.$route.query.uuid,
        blacklist: this.enable.value.toString()
      }
      console.log('456789', data)
      setMemberBlack(data).then(res => {
        if (data.blacklist === '0') {
          this.$message.success('已啟用帳號')
          this.getmemdetailList()
          this.isShow = !this.isShow
        } else {
          this.$message.error('已停用帳號')
          this.getmemdetailList()
          this.isShow = !this.isShow
        }
      })
    },
    async wdlimitcap () {
      console.log('check', this.awlist.level, this.temlist.level)
      if (this.awlist.level !== undefined) {
        if (this.awlist.level < this.temlist.level) {
          this.levelType = 1
          this.level = this.temlist.level
        } else {
          this.levelType = 0
          this.level = this.awlist.level
        }
      } else if (this.temlist.level === undefined) {
        this.$message.error('請選擇臨時上限')
      } else if (this.queryInfo.desc === '') {
        this.$message.error('請輸入調整原因')
      } else {
        this.levelType = 1
        this.level = this.temlist.level
      }
      console.log('bbbb', this.awlist.level)
      console.log('tttt', this.level, this.levelType)
      let data = {
        mg_name: localStorage.getItem('mg_name'),
        mg_pwd: localStorage.getItem('mg_pwd'),
        mg_state: localStorage.getItem('mg_state'),
        uuid: this.$route.query.uuid,
        levelType: this.levelType.toString(),
        level: this.level.toString(),
        reason: this.queryInfo.desc
      }
      console.log('456789', data)
      await setMemberLv(data).then(res => {
        console.log('1448565', data)
        if (res.error_code === 0) {
          this.$message.success('已送出提領上限申請')
          this.getmemdetailList()
          this.ssShow = !this.ssShow
        } else {
          this.$message.error('送出錯誤,請確認資料是否遺漏或是重複申請')
          this.getmemdetailList()
        }
      })
    }

  }
}
</script>

<style lang="less" scoped>
.txt {
  color: #02a7f0;
  font-size: 14px;
  font-weight: bold;
}

td {
  border-bottom: 2px solid #f0f0f0;
}
.tabletxt {
  font-size: 12px;
  border-collapse: separate;
  border-spacing: 0px 10px;
  width: 100%;
}
.unbindtxt{
  color:#D0D0D0;
}
</style>
