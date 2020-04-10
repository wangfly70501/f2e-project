
<template>
<div class="demo-input-suffix">
  <span class="title">轉預算時間：</span>
  <el-date-picker
    :editable="false"
    v-model="startBudgetTime"
    :picker-options="pickerOptionsStart"
    size="mini"
    type="datetime"
    value-format="timestamp"
    format="yyyy-MM-dd HH:mm:ss"
    placeholder="選擇開始日期"
    @change="changeEnd"/>-
  <el-date-picker
    :editable="false"
    v-model="endBudgetTime"
    :picker-options="pickerOptionsEnd"
    size="mini"
    type="datetime"
    value-format="timestamp"
    format="yyyy-MM-dd HH:mm:ss"
    default-time="['23:59:59']"
    placeholder="選擇結束日期"
    @change="changeStart"/>
   <el-tooltip class="item" effect="dark" content="Top Left 提示文字" placement="top-start">
      <el-button>上左</el-button>
    </el-tooltip>
    <div class="info-area">1234565</div>
</div>

</template>

<script>
export default {
  data () {
    return {
      // 限制開始時間
      pickerOptionsStart: {},
      pickerOptionsEnd: {},
      startBudgetTime: '', // 預算開始時間
      endBudgetTime: '' // 預算結束時間
    }
  },
  methods: {
    // 結束時間限制開始時間
    changeStart () {
      if (!this.endBudgetTime) {
        this.pickerOptionsStart = {
          disabledDate: {}
        }
        return
      }
      this.pickerOptionsStart = Object.assign({}, this.pickerOptionsStart, {
        // 可通過箭頭函式的方式訪問到this
        disabledDate: (time) => {
          var times = ''
          times = time.getTime() > this.endBudgetTime
          return times
        }
      })
    },
    // 開始時間 控制結束時間
    changeEnd () {
      if (!this.startBudgetTime) {
        this.pickerOptionsEnd = {
          disabledDate: {}
        }
        return
      }
      this.pickerOptionsEnd = Object.assign({}, this.pickerOptionsEnd, {
        disabledDate: (time) => {
          return time.getTime() < this.startBudgetTime
        }
      })
    }
  }
}
</script>

<style lang="scss" >
        $info:#B9CAD4;

        $error:red;
        $success:#064B74;
.info-area {
  color: $info;
  border: 1px solid $success;
  background-color: $info;
}
</style>
