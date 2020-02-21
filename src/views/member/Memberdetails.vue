<template>
  <el-card>
    <!--    <SearchTool v-model="queryInfo.query" placeholder="暫不支持搜索">
    </SearchTool>-->

    <!-- 會員詳細資料 -->
    <div>
      <p class="txt">
        會員資料

        <el-button icon="el-icon-edit" type="primary" size="mini" style="float:right"  v-show="isShow"  @click="showToggle"></el-button>

         <el-button  type="primary" size="mini" style="float:right" v-show="!isShow" >儲存</el-button>
          <el-button  type="primary" size="mini" style="float:right"  @click="showToggle"  v-show="!isShow" plain>取消</el-button>

      </p>
           <template v-for="item in userList">
          <template v-if="item.status===0" >帳號停用中</template>
          <template v-else>帳號啟用中</template>
        </template>
    </div>
    <table class="tabletxt">
          <tr  v-show="!isShow" style="background-color:#FFFF6F">
        <td>
          <p>帳號狀態：</p>
        </td>
        <td>
                        <el-select  v-model="enable.value" placeholder="請選擇狀態"
                         >
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
        <td>
          <template v-for="(item) in userList">{{item.uuid}}</template>
        </td>
      </tr>
      <tr>
        <td>
          <p>安全等級:</p>
        </td>
        <td>
          <template v-for="(item) in userList">LV{{item.level}}</template>
        </td>
      </tr>
      <tr>
        <td>
          <p>台幣資產:</p>
        </td>
        <td>
          <template v-for="(item) in userList">{{item.amount |NumFormat}} TWD</template>
        </td>
      </tr>
      <tr>
        <td>
          <p>EMAIL:</p>
          <p>手機:</p>
        </td>

        <td>
          <p>
            <template v-for="(item) in userList">{{item.email}}</template>
          </p>
          <template v-for="(item) in userList">{{item.mobile}}</template>
        </td>
      </tr>
      <tr>
        <td>
          <p>會員姓名:</p>
          <p>身分證字號:</p>
        </td>

        <td>
          <p>
            <template v-for="(item) in userList">{{item.username}}</template>
          </p>
          <template v-for="(item) in userList">{{item.identityid}}</template>
        </td>
      </tr>
      <tr>
        <td>
          <p>綁定銀行:</p>
          <p>銀行戶名:</p>
        </td>

        <td>
          <p>
            <template v-for="(item) in userList">{{item.bankacount}}</template>
          </p>
          <template v-for="(item) in userList">{{item.bankusrname}}</template>
        </td>
      </tr>
    </table>
    <!-- 單日提領上限 -->
    <div>
      <p class="txt">
        單日提領上限
       <el-button icon="el-icon-edit" type="primary" size="mini" style="float:right"  v-show="ssShow"  @click="showlimit"></el-button>

         <el-button  type="primary" size="mini" style="float:right" v-show="!ssShow" >儲存</el-button>
          <el-button  type="primary" size="mini" style="float:right"  @click="showlimit"  v-show="!ssShow" plain>取消</el-button>
      </p>
    </div>
    <table class="tabletxt">
            <tr v-show="!ssShow" style="background-color:#FFFF6F">
        <td>
          <p>永久上限:</p>
          <p>臨時上限:</p>
          <p>調整原因:</p>
        </td>
        <td>
          <p><template v-for="(item) in userList">
            <template v-if="item.awlimit!=''">{{item.awlimit |NumFormat}}</template>
            <template v-else>{{item.awlimit |NumFormat}}</template>
          </template></p>
          <p><template v-for="(item) in userList">{{item.uuid}}</template></p>
          <p><template v-for="(item) in userList">{{item.uuid}}</template></p>
        </td>
      </tr>
      <tr v-show="ssShow">
        <td>
          <p>永久上限:</p>
          <p>臨時上限:</p>
        </td>
        <td>
          <p>
            <template v-for="(item) in userList">{{item.awlimit |NumFormat}} TWD(會員等級{{item.level}})</template>
          </p>
          <p>
            <template v-for="(item) in userList">{{item.uuid|NumFormat}}</template>
          </p>
        </td>
      </tr>
    </table>
  </el-card>
</template>

<script>
/* import { userData } from '../../api/index.js' */

export default {
  data () {
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      orderList: [],
      total: 0,
      isDisabl: true,
      userList: [
        {
          status: 1,
          uuid: '10080',
          username: '王大力',
          identityid: 'b123456789',
          mobile: '0911111111',
          level: 1,
          amount: 10000000,
          lg_in_time: '2020-02-19 11:03',
          lg_out_time: '2020-02-19 11:03',
          email: 'wang777@gmail.com',
          bankacount: '111111111111',
          bank: '國泰世華',
          bankusrname: '測試資料',
          awlimit: '1000000'
        }
      ],
      isShow: true,
      ssShow: true,
      addressVisible: false,
      enable: [
        {
          label: '帳號停用',
          value: '0'
        },
        {
          label: '帳號啟用',
          value: '1'
        }
      ]
    }
  },

  created () {
    /* this.getUserList() */
  },

  methods: {
    /*     async getUserList () {
      let data = {
        mg_name: localStorage.getItem('mg_name'),
        mg_pwd: localStorage.getItem('mg_pwd'),
        mg_state: localStorage.getItem('mg_state'),
        paginate: this.queryInfo.pagesize,
        page: this.queryInfo.pagenum,
        searchValue: this.searchlist
      }
      await userData(data).then(res => {
        this.userList = res.data
        console.log('1323', this.userList)
        this.total = res.pagination.total_record
      })
    }, */
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.getUserList()
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
  border-bottom: 2px solid #F0F0F0;
}
.tabletxt {
  font-size: 14px;
  border-collapse: separate;
  border-spacing: 0px 10px;
  width: 100%;
}
</style>
