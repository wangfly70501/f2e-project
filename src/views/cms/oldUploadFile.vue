<template>
  <div>
    <input class="input_upload_file" type="file"
           :class="className"
           :accept="formatValue"
           ref="upload"
           @change="tellFun"/>
    <div class="upload-div"
         @click="uploadClick"></div>
  </div>
</template>

<script>
import { uploadAuthImg } from '@/api/backendAPI';
import {uploadban } from '../../api/index.js'
export default {
  name: 'uploadFile',
  props: {
    // 最大尺寸
    maxSize: {
      type: String,
      default: '5',
    },
    imageType: {
      type: String,
      default: '2',
    },
    // 上传数据类型
    formatValue: {
      type: String,
      default: 'image/jpeg, image/jpg, image/png',
    },
    // 接口名
    url: {
      type: String,
      default: '',
    },
    // 外部传入name
    name: {
      type: String,
      default: '',
    },
    // 外部传入请求类型
    isOpenUploadImg: {
      type: String,
      default: '',
    },
    // 外部传入可拓展项
    expand: {
      type: Array,
      default: () => [],
    },
    // className
    className: {
      type: String,
      default: '',
    },
    // isWaterMark 添加水印
    isWaterMark: {
      type: Boolean,
      default: false,
    },
    userUuid: {
      type: Number,
      default: null,
    },
    imgOrder: {
      type: String,
      default: '1',
    },
  },
  data() {
    return {
      // 真实文件尺寸
      size: '',
      // 真实文件格式
      realFormatValue: '',
      // 上傳 url
      uploadImgUrl: ''
    };
  },
  mounted() {
  },
  computed: {
  },
  watch: {

  },
  methods: {
    uploadClick() {
      this.$refs.upload.click();
    },
    tellFun(e) {
      const val = e.target.files[0];
      let self = this;

      if (val.size > this.maxSize * 1024 * 1024) {
        this.$emit('tellMessage', {
          error: '图片尺寸过大',
        });
        e.target.value = '';
      } else {
        this.$emit('tellMessage', {
          name: this.name,
        });
        const formData = new FormData();

      formData.append('title', this.addForm.title)
      formData.append('lang', this.addForm.lang)
      formData.append('type', this.addForm.type)
      formData.append('publicPic', file)
      formData.append('classify', this.addForm.classify)
      formData.append('sort', this.addForm.sort)
      formData.append('mg_name', localStorage.getItem('mg_name'))
      formData.append('mg_pwd', localStorage.getItem('mg_pwd'))
      formData.append('mg_state', localStorage.getItem('mg_state'))
        // 添加水印
        if (this.isWaterMark) {
          formData.append('isWaterMark', 1);
        }
        if (this.expand.length > 0) {
          this.expand.forEach((item) => {
            formData.append(Object.keys(item)[0], item[Object.keys(item)[0]]);
          });
        }


        // console.log(this.userUuid, this.imgOrder);

        uploadban(formData).then((res)=>{
          if (!Number(res.code) || String(res.code) === '0') {
            const { data } = res;
            const fileName = data.data.picName;
    
            e.target.value = '';
            console.log(res);

            const reader = new FileReader();
            reader.readAsDataURL(val);
            reader.onload = () => {
              this.$emit('uploadFinish', { 
                url: '', 
                fileName,
                b64: reader.result });
            };

          } else {
            this.$emit('uploadFinish', { error: this.$t('common.imgFiail') });
          }
        });
      }
    },
  },
};
</script>

<style scoped lang="stylus">
.input_upload_file{
  opacity: 0;
}
.upload-div{
  width:100%;
  height:100%;
  position: absolute;
  top:0;
  opacity: 0;
  z-index: 3;
  cursor: pointer;
}
</style>
