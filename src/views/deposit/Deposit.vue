<template>
  <div>
    <TopBreadcrumb :titles="['財務管理','出入金管理']"></TopBreadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <SearchTool v-model="queryInfo.query" @search="getGoodsList" style="width:80%">
        <!--         <el-col :span="4">
          <el-button type="primary" @click="toAddpage">搜尋</el-button>
        </el-col>-->
      </SearchTool>

      <!-- 搜尋區域 -->
      <!-- 下拉式選單 -->

      <el-select v-model="queryInfo.coin" placeholder="幣種">
        <el-option label="TWD" value="TWD"></el-option>
      </el-select>&nbsp;
      <el-select v-model="queryInfo.payment" placeholder="出/入金">
        <el-option label="入金" value="入金"></el-option>
        <el-option label="出金" value="出金"></el-option>
      </el-select>&nbsp;
      <!--   日期 -->
      <el-date-picker
        type="daterange"
        start-placeholder="開始日期"
        end-placeholder="結束日期"
        v-model="queryInfo.date"
        value-format="yyyy-MM-dd"
        style="width:20%;"
      ></el-date-picker>&nbsp;
      <el-button type="primary" icon="el-icon-search" @click="handleSearch"></el-button>
      <!-- table表格区域 -->
      <el-table :data="goodsList" border stripe>
        <el-table-column label="序號" prop="" width="100px"></el-table-column>
        <el-table-column label="類別" prop="goods_state"></el-table-column>
        <el-table-column label="帳號" prop="goods_name"></el-table-column>
        <el-table-column label="銀行" prop="goods_price"></el-table-column>
        <el-table-column label="幣種" prop="goods_weight"></el-table-column>
        <el-table-column label="手續費" prop="goods_number" ></el-table-column> -->
        <el-table-column label="金額" prop="goods_number"></el-table-column>
        <el-table-column label="申請時間">
          <template slot-scope="scope">{{scope.row.add_time | dateFormat}}</template>
        </el-table-column>
        <el-table-column label="狀態" width="80px"></el-table-column>
        <el-table-column label="操作" width="130px">
          <template slot-scope="scope">
            <el-button
              type="primary"
              @click="handleView(scope.$index, scope.row)"
              size="mini"
              icon="el-icon-document"
            ></el-button>
            <!-- <el-button type="primary" icon="el-icon-edit"
            size="mini" @click="handleEdit"></el-button>-->
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeGoodsById(scope.row.goods_id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        background
      ></el-pagination>
    </el-card>
    <!-- show的对话框 -->
    <el-dialog :visible.sync="showDialogVisible" width="80%">
      <el-form ref="form" :model="form" label-width="70px">
        <table width="80%" border="1" class="table">
          <tr style="font-weight:bold;padding:15px 20px">
            <td>帳號</td>
            <td>銀行</td>
            <td>幣種</td>
            <td>申請金額</td>
            <td>最後金額</td>
            <td>總金額</td>
            <td>手續費</td>
            <td>日期</td>
            <td>出/入金</td>
          </tr>
          <tr style="padding:15px 20px;">
            <td>{{form.goods_name}}</td>
            <td>{{form.goods_price}}</td>
            <td>{{form.goods_weight}}</td>
            <td>{{form.goods_number}}</td>
            <td>{{form.goods_number}}</td>
            <td>{{form.goods_number}}</td>
            <td>{{form.goods_number}}</td>
            <td>{{form.add_time}}</td>
            <td>{{form.goods_state}}</td>
          </tr>
        </table>
      </el-form>
      <!--              <el-table :data="goodsList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="帳號" prop="goods_name"  ></el-table-column>
      </el-table>-->
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10,
        Coin: '',
        payment: '',
        date: ''
      },
      goodsList: [],
      total: 0,
      form: {},
      idx: -1,
      showDialogVisible: false
    }
  },

  created () {
    this.getGoodsList()
    this.handleSearch()
  },

  methods: {
    async getGoodsList () {
      const { data: res } = await this.$http.get('goods', {
        params: this.queryInfo
      })

      if (res.meta.status !== 200) {
        return this.$message.error('获取商品列表失败')
      }
      this.goodsList = res.data.goods
      this.total = res.data.total
    },
    toAddpage () {
      this.$router.push('/goods/add')
    },
    async removeGoodsById (id) {
      const confirmResult = await this.$confirm(
        '此操作将永久删除该商品, 是否继续?',
        '提示',
        {
          type: 'warning'
        }
      ).catch(err => err)

      if (confirmResult !== 'confirm') {
        return this.$message.info('操作已取消')
      }

      const { data: res } = await this.$http.delete(`goods/${id}`)

      if (res.meta.status !== 200) {
        return this.$message.error('删除失败')
      }

      this.$message.success('删除成功')
      this.getGoodsList()
    },
    /*     handleEdit () {
      this.$message.error('暂不支持编辑商品')
    }, */
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.getGoodsList()
    },
    handleCurrentChange (newPage) {
      this.queryInfo.pagenum = newPage
      this.getGoodsList()
    },
    handleView (index, row) {
      this.idx = index
      console.log(index)
      this.form = row
      this.showDialogVisible = true
    },
    // 篩選區
    handleSearch () {
      /*    const { data: res } = await this.$http.get('goods', {
        params: this.queryInfo
      })

      if (res.meta.status !== 200) {
        return this.$message.error('获取商品列表失败')
      }
      this.List = res.data.goods
      console.log('123', res.data.goods)
      this.total = res.data.total */
      //

      if ((this.queryInfo.payment === '入金', '出金' && this.queryInfo.Coin === 'TWD')) {
        console.log('i')
        this.$http.get('goods').then(res => {
          let dataa = []
          res.data.goods.forEach((item, index) => {
            if (
              item.goods_state === this.queryInfo.payment &&
              item.goods_weight === this.queryInfo.Coin
            ) {
              dataa.push(item)
              console.log(item.goods_weight)
            }
          })
          this.GoodsList = dataa
        })
      } else {
        this.$http.get('goods').then(res => {
          // console.log(res);
          this.GoodsList = res.data.goods
        })
      }
    }
  }
}
</script>

<style>
.table {
  width: 100%;
  font-size: 14px;
  border: 0.5px solid #ddd;
  border-collapse: collapse;
}
td {
  padding: 8px;
}
</style>
