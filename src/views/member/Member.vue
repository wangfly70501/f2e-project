<template>
  <div>
    <TopBreadcrumb :titles="['會員管理', '會員列表']"></TopBreadcrumb>

    <el-card>
                      <el-select  v-model="enablevalue" placeholder="狀態"
                         style="width:8% "
                         size='small'
                         clearable>
                            <el-option
                                v-for="(enableValue,index) in enable"
                                :key="index"
                                v-bind:label="enableValue.label"
                                v-bind:value="enableValue.value"

                            >{{enableValue.label}}</el-option>
                        </el-select>&nbsp;
        <el-input v-model="searchlist" @keyup.enter.native="Search" style="width:20%" placeholder="姓名/身分證字號/手機/UID" size='small' clearable></el-input>&nbsp;
                              <el-select  v-model="memlevelvalue" placeholder="會員等級"
                         style="width:15% "
                         size='small'
                         clearable>
                            <el-option
                                v-for="(memlevel,index) in memlevel"
                                :key="index"
                                v-bind:label="memlevel.label"
                                v-bind:value="memlevel.value"
                            >{{memlevel.label}}</el-option>
                        </el-select>&nbsp;
                        <el-select  v-model="safelevelvalue" placeholder="安全等級"
                         style="width:15% " size='small' clearable>
                            <el-option
                                v-for="(safelevel,index) in safelevel"
                                :key="index"
                                v-bind:label="safelevel.label"
                                v-bind:value="safelevel.value"
                            >{{safelevel.label}}</el-option>
                        </el-select>&nbsp;
                           <el-button type="primary" @click="clear" size='small'>清除</el-button>
                           <el-button type="primary" @click="Search" size='small'>查詢</el-button>
      <!-- 會員列表数据 -->
      <el-table :data="userList" :header-cell-style="tableHeaderColor">
        <el-table-column type="index" label="編號" width="50px" align="center"></el-table-column>
 <!--        <el-table-column label="狀態" prop="blacklist" width="50px" align="center">
          <template slot-scope="scope">
            <div  v-if="scope.row.blacklist =='1'"><i class="fas fa-circle"  color="red"></i></div>
            <div  v-else color="#00EC00"><i class="fas fa-circle"  color="#00EC00"></i></div>
          </template>
        </el-table-column> -->

        <el-table-column label="UID" prop="uuid" align="center">
                <template slot-scope="scope">
                  <router-link  :to="{path:'/membercatch',query:{uuid:`${scope.row.uuid}`}}" > {{scope.row.uuid}}</router-link>
                </template>
        </el-table-column>
        <el-table-column label="會員姓名" prop="username" align="left"></el-table-column>

        <!-- <el-table-column label="身分證字號" prop="identityid">
              <template slot-scope="scope">
                 {{scope.row.identityid|phoneformat}}
                </template></el-table-column> -->

                <el-table-column label="信箱" prop="email" width="220%"></el-table-column>
        <el-table-column label="手機" prop="mobile">

                        <template slot-scope="scope">
                 {{scope.row.mobile|phoneformat}}
                </template>
        </el-table-column>
        <!-- <el-table-column label="會員帳號" prop="account"></el-table-column> -->

        <el-table-column label="安全等級" align="center" style="color:white">
           <template slot-scope="scope">
             <span v-if="scope.row.securityLevel==='1'" class="lv1">Lv.1</span>
             <span v-else-if="scope.row.securityLevel==='2'" class="lv2">Lv.2</span>
             <span v-else-if="scope.row.securityLevel==='3'" class="lv3">Lv.3</span>
          </template></el-table-column>
           <el-table-column label="提領上限" prop="level" align="center">
             <template slot-scope="scope">
           <span v-if="scope.row.level===0">100,000</span>
           <span v-else-if="scope.row.level===1">300,000</span>
           <span v-else-if="scope.row.level===2">500,000</span>
          </template>
           </el-table-column>

         <el-table-column label="台幣資產" align="center">
           <template slot-scope="scope">
            <span v-if="scope.row.amount===0"> 0</span>
            <span v-else> {{scope.row.amount | NumFormat}}</span>
          </template>
          </el-table-column>

        <el-table-column label="註冊時間" >
          <template slot-scope="scope">
            {{scope.row.ctime | dateFormat}}
          </template>
        </el-table-column>
     <!--         <el-table-column label="登出時間" prop="lg_out_time">
          <template slot-scope="scope">
            {{scope.row.lg_out_time | dateFormat}}
          </template>
        </el-table-column> -->
<!--         <el-table-column label="操作">
          <template>
            <el-button size="mini" type="primary" icon="el-icon-edit"
          :disabled="isDisabl"></el-button>
            <el-button size="mini" type="success" icon="el-icon-location"
              :disabled="isDisabl"></el-button>
          </template>
        </el-table-column> -->
      </el-table>

      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[10, 20, 30]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>

  </div>
</template>

<script>
import { userData } from '../../api/index.js'

export default {
  data () {
    return {
      searchlist: '',
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      orderList: [],
      total: 0,
      isDisabl: true,
      enablevalue: '',
      memlevelvalue: '',
      safelevelvalue: '',
      userList: [/* {
        status: 1,
        uuid: '10080',
        username: '測試帳號',
        identityid: 'b123456789',
        mobile: '0911111111',
        level: 1,
        amount: 10000,
        lg_in_time: '2020-02-19 11:03',
        lg_out_time: '2020-02-19 11:03'

      },
      {
        status: 0,
        uuid: '10081',
        username: '測試帳號',
        identityid: 'b123456789',
        mobile: '0911111111',
        level: 2,
        amount: 10000,
        lg_in_time: '2020-02-19 11:03',
        lg_out_time: '2020-02-19 11:03'
      } */
      ],
      enable: [
        {
          label: '啟用中',
          value: 0
        },
        {
          label: '停用中',
          value: 1
        }
      ],
      memlevel: [
        {
          label: '會員等級0',
          value: 0
        },
        {
          label: '會員等級1',
          value: 1
        },
        {
          label: '會員等級2',
          value: 2
        }
      ],
      safelevel: [
        {
          label: '安全等級Lv.1',
          value: 1
        },
        {
          label: '安全等級Lv.2',
          value: 2
        },
        {
          label: '安全等級Lv.3',
          value: 3
        }
      ],
      addressVisible: false

    }
  },
  watch: {
    searchlist (newData, oldData) {
      if (newData.id === oldData.id) return
      this.$refs.audio.play()
    },
    enablevalue (newData, oldData) {
      if (newData.id === oldData.id) return
      this.$refs.audio.play()
    },
    memlevelvalue (newData, oldData) {
      if (newData.id === oldData.id) return
      this.$refs.audio.play()
    },
    safelevelvalue (newData, oldData) {
      if (newData.id === oldData.id) return
      this.$refs.audio.play()
    }

  },
  created () {
    this.getUserList()
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
    async getUserList () {
      let data = {
        mg_name: localStorage.getItem('mg_name'),
        mg_pwd: localStorage.getItem('mg_pwd'),
        mg_state: localStorage.getItem('mg_state'),
        paginate: this.queryInfo.pagesize,
        page: this.queryInfo.pagenum,
        searchValue: this.searchlist,
        searchBlacklist: this.enablevalue,
        searchMemberLevel: this.memlevelvalue,
        searchSecurityLevel: this.safelevelvalue

      }
      await userData(data).then(res => {
        this.userList = res.data
        console.log('1323', this.userList)
        this.total = res.pagination.total_record
      })
    },
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.getUserList()
    },
    handleCurrentChange (newPage) {
      this.queryInfo.pagenum = newPage
      this.getUserList()
    },
    async Search () {
      this.queryInfo.pagenum = 1
      await this.getUserList()
    },
    async clear () {
      this.searchlist = ''
      this.enablevalue = ''
      this.memlevelvalue = ''
      this.safelevelvalue = ''
      await this.getUserList()
    },
    tableHeaderColor ({ row, column, rowIndex, columnIndex }) {
      if (rowIndex === 0) {
        return 'background-color:#F2F2F2 ;color:#7B7B7B;font-size: 14px;'
      }
    } }
}
</script>

<style lang="less">
.el-cascader {
  width: 100%;
}
.lv1{
  background-color: #F4D375;
  padding: 5px 10px;
  color: white;
  border-radius: 5px;
}
.lv2{
  background-color: #6BBDBB;
  padding: 5px 10px;
  color: white;
   border-radius: 5px;
}
.lv3{
  background-color: #61C868;
  padding: 5px 10px;
  color: white;
   border-radius: 5px;
}
</style>
