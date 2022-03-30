<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>更换头像</span>
    </div>
    <div>
      <!-- 图片，用来展示用户选择的头像 -->
      <!-- 注意：img 标签的 src 属性，只接收两种类型的值 -->
      <!-- 1. 文件的存放路径 -->
      <!-- 2. base64 格式的字符串 -->
      <img :src="imgSrc" alt="" class="preview" v-if="imgSrc" />
      <img src="@/assets/images/avatar.jpg" alt="" class="preview" v-else />

      <!-- 按钮区域 -->
      <div class="btn-box">
        <!-- 文件选择器 -->
        <!-- accept 可以指定选择的文件类型 -->
        <!-- image/gif,image/png,image/jpeg -->
        <!-- 文件选择器有一个 change 事件，只要选择的文件发生了变化，就会触发 change -->
        <input type="file" style="display: none" accept="image/*" ref="iptFileRef" @change="onFileChange" />
        <el-button type="primary" icon="el-icon-plus" @click="chooseImg">选择图片</el-button>
        <el-button type="success" icon="el-icon-upload" :disabled="imgSrc === ''" @click="updateAvatar"
          >上传头像</el-button
        >
      </div>
    </div>
  </el-card>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import request from '@/utils/request'
@Component({})
export default class UserAvatar extends Vue {
  imgSrc = ''
  // 点击了选择图片的按钮
  chooseImg () {
    // 用 JS 代码，模拟了元素的点击行为
    (this.$refs.iptFileRef as HTMLInputElement).click()
  }

  // 文件选择器，选中的文件发生了变化
  onFileChange (e: any) {
    // 获取用户选择的文件列表，是一个伪数组
    // 伪数组：本质上是对象，只不过对象的“键”是数字，而且包含 length 属性
    const files = e.target.files

    if (files.length === 0) {
      // 没有选择任何文件
    } else {
      // 选中了文件
      // TODO：把 files[0] 这个文件对象，转为 base64 的字符串
      const fr = new FileReader()
      // fr.readAsDataURL(文件) 表示把指定的文件，读取成 base64 的字符串
      fr.readAsDataURL(files[0])
      // onload 被触发，表示文件读取完毕啦
      fr.onload = () => {
        this.imgSrc = fr.result as string
      }
    }
  }

  // 点击按钮，调用接口，上传头像
  async updateAvatar () {
    // 调接口
    const result = await request.patch('/my/update/avatar', { avatar: this.imgSrc })
    // 提示用户成功了
    this.$message.success(result.data.message)
    // 调用 actions 函数，刷新全局的用户信息
    // this.$store.dispatch('user/initUserInfo')
    this.initUserInfo()
  }

  async initUserInfo () {
    const { data } = await request.get('/my/userinfo')
    this.$store.commit('user/updateInfo', data.data)
  }
}
</script>

<style lang="less" scoped>
.btn-box {
  margin-top: 10px;
}
.preview {
  object-fit: cover;
  width: 350px;
  height: 350px;
}
</style>
