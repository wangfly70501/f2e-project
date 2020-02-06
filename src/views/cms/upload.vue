<template>
 <el-upload
  list-type="picture-card"
  action="''"
  :http-request="upload"
  :before-upload="beforeAvatarUpload">
  <i class="el-icon-plus"></i>
 </el-upload>
</template>
 
<script>
 import {getAliOSSCreds} from '@/api/common' // 向後端獲取 OSS祕鑰資訊
 import {createId} from '@/utils' // 一個生產唯一的id的方法
 import OSS from 'ali-oss'
 
 export default {
  name: 'imgUpload',
  data () {
   return {}
  },
  methods: {
   // 圖片上傳前驗證
   beforeAvatarUpload (file) {
    const isLt2M = file.size / 1024 / 1024 < 2
    if (!isLt2M) {
     this.$message.error('上傳頭像圖片大小不能超過 2MB!')
    }
    return isLt2M
   },
   // 上傳圖片到OSS 同時派發一個事件給父元件監聽
   upload (item) {
    getAliOSSCreds().then(res => { // 向後臺發請求 拉取OSS相關配置
     let creds = res.body.data
     let client = new OSS.Wrapper({
      region: 'oss-cn-beijing', // 伺服器叢集地區
      accessKeyId: creds.accessKeyId, // OSS帳號
      accessKeySecret: creds.accessKeySecret, // OSS 密碼
      stsToken: creds.securityToken, // 簽名token
      bucket: 'imgXXXX' // 阿里雲上儲存的 Bucket
     })
     let key = 'resource/' + localStorage.userId + '/images/' + createId() + '.jpg' // 儲存路徑，並且給圖片改成唯一名字
     return client.put(key, item.file) // OSS上傳
    }).then(res => {
     console.log(res.url)
     this.$emit('on-success', res.url) // 返回圖片的儲存路徑
    }).catch(err => {
     console.log(err)
    })
   }
  }
 }
</script>