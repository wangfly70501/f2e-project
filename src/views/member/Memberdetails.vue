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

        <el-button type="primary" size="mini" style="float:right" v-show="!isShow"  @click.once="acmange">儲存</el-button>
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
        <td v-if="userList.amount===0">{{userList.amount}} TWD</td>
        <td v-else>{{userList.amount |NumFormat}} TWD</td>
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
           <!--  <div v-if="userList.level_normal!=1||2" >{{100000|NumFormat}} (會員等級{{userList.level}})</div> -->
             <div v-if="userList.level==1" >{{300000|NumFormat}} (會員等級{{userList.level}})</div>
              <div v-else-if="userList.level==2" >{{500000|NumFormat}} (會員等級{{userList.level}})</div>
            <!--  <div v-else-if="userList.limitday='500000'" >{{userList.limitday |NumFormat}} (會員等級{{userList.level}})</div> -->
            <div v-else >
              <el-select v-model="levelnormal" placeholder="預設值" value-key="id">
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
            <el-select v-model="leveltemp" placeholder="預設值" value-key="id">
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

             <!--   <template v-if="userList.level_normal!=1||2" >{{100000|NumFormat}} (會員等級{{userList.level}})</template> -->
             <template  v-if="userList.level==1" >{{300000|NumFormat}} (會員等級{{userList.level}})</template>
              <template v-else-if="userList.level==2" >{{500000|NumFormat}} (會員等級{{userList.level}})</template>
                <template v-else>{{100000|NumFormat}} (會員等級{{userList.level}})</template>
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
            <p v-if="userList.level_temp==0" >未設定</p>

             <p v-else>{{userList.limitday_temp|NumFormat }} (會員等級{{userList.level_temp}})</p>
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
      leveltemp: '',
      levelnormal: '',
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
    this.objList()
  },

  methods: {

    objList () {
      this.objname = localStorage.getItem('mg_name')
      this.objpwd = localStorage.getItem('mg_pwd')
      console.log(typeof this.objname, this.objpwd)

      if (this.objname == null || this.objpwd == null) {
        this.$router.push('/login')
      }
    },
    async getmemdetailList () {
      let data = {
        mg_name: localStorage.getItem('mg_name'),
        mg_pwd: localStorage.getItem('mg_pwd'),
        mg_state: localStorage.getItem('mg_state'),
        uuid: this.$route.query.uuid
      }

      await memberDetail(data).then(res => {
        this.userList = res.data
        console.log('detail', this.userList)
        this.leveltemp = this.userList.level_temp
        console.log(this.userList.level_temp)
      })
    },

    showToggle () {
      this.isShow = !this.isShow
    },
    showlimit () {
      this.ssShow = !this.ssShow
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
      console.log('check', this.levelnormal, this.leveltemp)
      if (this.levelnormal === '') {
        this.levelnormal = 0
      } else if (this.leveltemp === '') {
        this.leveltemp = 0
      }

      console.log('永久上限', this.levelnormal)
      console.log('臨時上限', this.leveltemp)

      let data = {
        mg_name: localStorage.getItem('mg_name'),
        mg_pwd: localStorage.getItem('mg_pwd'),
        mg_state: localStorage.getItem('mg_state'),
        uuid: this.$route.query.uuid,
        level_normal: this.levelnormal.toString(),
        level_temp: this.leveltemp.toString(),
        reason: this.queryInfo.desc
      }
      console.log('456789', data)
      await setMemberLv(data).then(res => {
        console.log('1448565', data)
        if (res.error_code === 0) {
          if (this.levelnormal !== 0) {
            this.$message.success('已調整永久上限')
            this.ssShow = !this.ssShow
          } else {
            this.$message.success('已送出臨時提領上限申請')
            this.getmemdetailList()
            this.ssShow = !this.ssShow
          }
        } else if (res.error_code === 124) {
          this.$message.error('請確認資料是否重複申請')
        } else {
          this.$message.error('送出錯誤,請確認資料是否遺漏')
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
