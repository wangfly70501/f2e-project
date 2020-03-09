<template>
  <el-card>
    <!--    <SearchTool v-model="queryInfo.query" placeholder="暫不支持搜索">
    </SearchTool>-->

    <!-- 會員詳細資料 -->
    <div>
      <p class="txt" v-for="(item,index) in userList" :key="index">
        會員資料

        <el-button
          icon="el-icon-edit"
          type="primary"
          size="mini"
          style="float:right"
          v-show="isShow"
          @click="showToggle"
        ></el-button>

        <el-button type="primary" size="mini" style="float:right" v-show="!isShow">儲存</el-button>
        <el-button
          type="primary"
          size="mini"
          style="float:right"
          @click="showToggle"
          v-show="!isShow"
          plain
        >取消</el-button>
            <el-tag v-if="item.status===1" type="success" style="float:right">帳號啟用中</el-tag>
         <el-tag v-else type="danger">帳號停用中</el-tag>
      </p>
      <!--         <template v-for="item in userList">
          <template v-if="item.status===0" >帳號停用中</template>
          <template v-else>帳號啟用中</template>
      </template>-->
    </div>

    <table class="tabletxt" v-for="(item,index) in userList" :key="index">
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
        <td>{{item.uuid}}</td>
      </tr>
      <tr>
        <td>
          <p>安全等級:</p>
        </td>
        <td>LV{{item.level}}</td>
      </tr>
      <tr>
        <td>
          <p>台幣資產:</p>
        </td>
        <td>{{item.amount |NumFormat}} TWD</td>
      </tr>
      <tr>
        <td>
          <p>EMAIL:</p>
          <p>手機:</p>
        </td>

        <td>
          <p>{{item.email}}</p>
          <p v-if="item.mobile===''" class="unbindtxt">(尚未綁定)</p>
          <p v-else>{{item.mobile}}</p>
        </td>
      </tr>
      <tr>
        <td>
          <p>會員姓名:</p>
          <p>身分證字號:</p>
        </td>

        <td>
           <p v-if="item.username===''" class="unbindtxt">(尚未實名驗證)</p>
          <p v-else>{{item.username}}</p>
           <p v-if="item.identityid===''" class="unbindtxt">(尚未實名驗證)</p>
          <p v-else>{{item.identityid |phoneformat}}</p>
        </td>
      </tr>
      <tr>
        <td>
          <p>綁定銀行:</p>
          <p>銀行戶名:</p>
        </td>

        <td>
          <p v-if="item.bankacount===''" class="unbindtxt">(尚未綁定)</p>
          <p v-else>{{item.bankacount}}</p>
           <p v-if="item.bankusrname===''" class="unbindtxt">(尚未綁定)</p>
          <p v-else>{{item.bankusrname}}</p>
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

        <el-button type="primary" size="mini" style="float:right" v-show="!ssShow">儲存</el-button>
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
          <template v-for="(item, index) in userList">
            <div v-if="item.awlimit!=''" :key="index">{{item.awlimit |NumFormat}}</div>
            <div v-else :key="index">
              <el-select v-model="awlist.value" placeholder="預設值">
                <el-option
                  v-for="(awlistValue,index) in awlist"
                  :key="index"
                  v-bind:label="awlistValue.label"
                  v-bind:value="awlistValue.value"
                >{{awlistValue.label |NumFormat}} TWD(會員等級{{item.level}})</el-option>
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
          <template v-for="(item, index) in userList">
            <el-select v-model="awlist.value" placeholder="預設值" :key="index">
              <el-option
                v-for="(awlistValue,index) in awlist"
                :key="index"
                v-bind:label="awlistValue.label"
                v-bind:value="awlistValue.value"
              >{{awlistValue.label |NumFormat}} TWD(會員等級{{item.level}})</el-option>
            </el-select>
          </template>
        </td>
      </tr>
            <tr v-show="!ssShow" style="background-color:#FFFF6F">
        <td>
          <p>調整原因:</p>
        </td>
        <td>
             <el-input type="textarea" v-model="queryInfo.desc"></el-input>
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
             <template v-for="(item) in userList">{{item.awlimit |NumFormat}} TWD(會員等級{{item.level}})</template>
          </p>
        </td>
      </tr>

      <tr>
        <td>
          <p>臨時上限:</p>
        </td>
        <td>
          <p>
            <template v-for="(item,index) in userList">
            <p v-if="item.amount===''"  :key="index">未設定</p>
             <p v-else  :key="index">{{item.amount |NumFormat}}</p>
           </template>
          </p>
        </td>
      </tr>
    </table>
  </el-card>
</template>

<script>
import { memberDetail } from '../../api/index.js'

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
      /*      userList: [
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
      userList: {},
      isShow: true,
      ssShow: true,
      addressVisible: false,
      enable: [
        {
          label: '帳號停用',
          value: '1'
        },
        {
          label: '帳號啟用',
          value: '0'
        }
      ],
      awlist: [
        {
          label: '1000000',
          value: '1000000'
        },
        {
          label: '2000000',
          value: '2000000'
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
    }
  }
}
</script>

<style lang="less" scoped>
.txt {
  color: #02a7f0;
  font-size: 15px;
  font-weight: bold;
}

td {
  border-bottom: 2px solid #f0f0f0;
}
.tabletxt {
  font-size: 14px;
  border-collapse: separate;
  border-spacing: 0px 10px;
  width: 100%;
}
.unbindtxt{
  color:#D0D0D0;
}
</style>
