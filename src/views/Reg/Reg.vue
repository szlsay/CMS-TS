<template>
  <div class="con-reg">
    <div class="box-reg">
      <div class="box-reg-title"></div>
      <!-- 注册的表单 -->
      <el-form>
        <!-- 用户名的 item 项 -->
        <el-form-item>
          <el-input placeholder="请输入用户名"></el-input>
        </el-form-item>
        <!-- 密码的 item 项 -->
        <el-form-item>
          <el-input placeholder="请输入密码"></el-input>
        </el-form-item>
        <!-- 确认密码的 item 项 -->
        <el-form-item>
          <el-input placeholder="请再次确认密码"></el-input>
        </el-form-item>
        <!-- 注册按钮的 item 项 -->
        <el-form-item>
          <el-button type="primary" style="width: 100%">注册</el-button>
          <el-link type="info">去登录</el-link>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue } from 'vue-property-decorator'
export default class Reg extends Vue {
}
</script>
<style lang="less" scoped>
.con-reg{
  background: url('~@/assets/images/login_bg.jpg') no-repeat;
  background-size: cover;
  height: 100%;

  .box-reg{
    box-sizing: border-box;
    width: 400px;
    height: 335px;
    background-color: white;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    padding: 0 25px;
    border-radius: 4px;

    .box-reg-title {
      height: 60px;
      background: url('~@/assets/images/login_title.png') no-repeat;
      background-position: center;
    }
  }
}
</style>
