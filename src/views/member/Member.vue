<template>
  <div>
    <TopBreadcrumb :titles="['會員管理', '會員列表']"></TopBreadcrumb>

    <el-card>
                      <el-select  v-model="enable.value" placeholder="狀態"
                         style="width:8% "
                         size='small'>
                            <el-option
                                v-for="(enableValue,index) in enable"
                                :key="index"
                                v-bind:label="enableValue.label"
                                v-bind:value="enableValue.value"

                            >{{enableValue.label}}</el-option>
                        </el-select>&nbsp;
        <el-input v-model="searchlist" @keyup.enter.native="Search" style="width:20%" placeholder="姓名/身分證字號/手機/UUID" size='small'></el-input>&nbsp;
                              <el-select  v-model="memlevel.value" placeholder="會員等級"
                         style="width:15% "
                         size='small'>
                            <el-option
                                v-for="(memlevel,index) in memlevel"
                                :key="index"
                                v-bind:label="memlevel.label"
                                v-bind:value="memlevel.value"
                            >{{memlevel.label}}</el-option>
                        </el-select>&nbsp;
                                                    <el-select  v-model="safelevel.value" placeholder="安全等級"
                         style="width:15% " size='small'>
                            <el-option
                                v-for="(safelevel,index) in safelevel"
                                :key="index"
                                v-bind:label="safelevel.label"
                                v-bind:value="safelevel.value"
                            >{{safelevel.label}}</el-option>
                        </el-select>&nbsp;
                           <el-button type="primary" @click="Search" size='small'>查詢</el-button>
      <!-- 會員列表数据 -->
      <el-table :data="userList" :header-cell-style="tableHeaderColor">
        <el-table-column type="index" ></el-table-column>
        <el-table-column label="狀態" prop="blacklist" width="50px">
          <template slot-scope="scope">
            <div  v-if="scope.row.blacklist =='1'"><i class="fas fa-circle"  color="red"></i></div>
            <div  v-else color="#00EC00"><i class="fas fa-circle"  color="#00EC00"></i></div>
          </template>
        </el-table-column>

        <el-table-column label="UUID" prop="uuid">
                <template slot-scope="scope">
                  <router-link  :to="{path:'/membercatch',query:{uuid:`${scope.row.uuid}`}}" > {{scope.row.uuid}}</router-link>
                </template>
        </el-table-column>
        <el-table-column label="會員姓名" prop="username"></el-table-column>

        <el-table-column label="身分證字號" prop="identityid">
              <template slot-scope="scope">
                 {{scope.row.identityid|phoneformat}}
                </template></el-table-column>
        <el-table-column label="手機" prop="mobile">

                        <template slot-scope="scope">
                 {{scope.row.mobile|phoneformat}}
                </template>
        </el-table-column>
        <!-- <el-table-column label="會員帳號" prop="account"></el-table-column> -->

        <el-table-column label="會員等級" prop="level"></el-table-column>

        <el-table-column label="安全等級" >
           <template slot-scope="scope">
           LV{{scope.row.securityLevel }}
          </template></el-table-column>

 <el-table-column label="台幣資產" > <template slot-scope="scope">
            {{scope.row.amount | NumFormat}}
          </template></el-table-column>

        <el-table-column label="登入時間" prop="lg_in_time">
          <template slot-scope="scope">
            {{scope.row.lg_in_time | dateFormat}}
          </template>
        </el-table-column>
             <el-table-column label="登出時間" prop="lg_out_time">
          <template slot-scope="scope">
            {{scope.row.lg_out_time | dateFormat}}
          </template>
        </el-table-column>
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
        :page-sizes="[5, 10, 15]"
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
          value: 0
        },
        {
          label: '安全等級Lv.2',
          value: 1
        },
        {
          label: '安全等級Lv.3',
          value: 2
        }
      ],
      addressVisible: false

    }
  },

  created () {
    this.getUserList()
  },

  methods: {
    async getUserList () {
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
      /* await this.getFaqList() */
    },
    tableHeaderColor ({ row, column, rowIndex, columnIndex }) {
      if (rowIndex === 0) {
        return 'background-color:#F2F2F2 ;color:#7B7B7B;font-size: 14px;'
      }
    } }
}
</script>

<style lang="less" scoped>
.el-cascader {
  width: 100%;
}
</style>
