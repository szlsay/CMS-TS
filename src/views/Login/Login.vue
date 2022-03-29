<template>
  <div class="container-login">
    <div class="box-login">
      <div class="box-login-title"></div>
      <!-- 注册的表单 -->
      <!-- :model="数据对象" -->
      <!-- :rules="验证规则对象" -->
      <el-form :model="loginForm" :rules="loginFormRules" ref="loginFormRef">
        <!-- 用户名的 item 项 -->
        <el-form-item prop="username">
          <!-- prefix-icon 表示前置图标 -->
          <el-input placeholder="请输入用户名" prefix-icon="el-icon-user" v-model="loginForm.username"></el-input>
        </el-form-item>
        <!-- 密码的 item 项 -->
        <el-form-item prop="password">
          <el-input placeholder="请输入密码" type="password" v-model="loginForm.password">
            <!-- 插槽的节点 -->
            <!-- prefix 表示前置的插槽 -->
            <!-- suffix 表示后置的插槽 -->
            <!-- 下面这行代码，表示的含义： -->
            <!-- 把 i 元素，放到名字为 prefix 的 slot 插槽中显示 -->
            <!-- 注意：slot="插槽的名字" 是 vue2 的旧语法，在 vue3 中不受支持 -->
            <i slot="prefix" class="el-input__icon el-icon-lock"></i>
          </el-input>
        </el-form-item>
        <!-- 注册按钮的 item 项 -->
        <el-form-item>
          <el-button type="primary" style="width: 100%" @click="login">登录</el-button>
          <!-- $router 是路由导航对象，里面提供了编程式导航的各种 API 函数 -->
          <el-link type="info" @click="$router.push('/reg')">去注册</el-link>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { Form } from 'element-ui'
import type { LoginForm } from '@/types/login'
// 导入封装好的 axios 模块
import request from '@/utils/request'
@Component({})
export default class Login extends Vue {
  // 登录表单的数据对象
  loginForm:LoginForm = {
    username: '',
    password: ''
  };

  // 验证规则对象
  loginFormRules = {
    username: [
      // 必填项
      { required: true, message: '用户名是必填项', trigger: 'blur' },
      // 正则验证
      { pattern: /^[a-zA-Z0-9]{1,10}$/, message: '用户名必须是1-10位的字母数字', trigger: 'blur' }
    ],
    password: [
      // 必填项
      { required: true, message: '密码是必填项', trigger: 'blur' },
      // 正则验证
      { pattern: /^\S{6,15}$/, message: '密码必须是6-15位的非空字符', trigger: 'blur' }
    ]
  };

  // 点击按钮，进行登录
  login (): void {
    // 1. 对登录表单进行数据校验
    // 2. 校验通过后，封装并调用登录的 API 接口
    (this.$refs.loginFormRef as Form).validate(async valid => {
      if (!valid) return
      const result = await request.post('/api/login', this.loginForm)
      // 1. 提示用户登录成功
      this.$message.success(result.data.message)
      // 2. 保存 token
      // this.$store.commit('模块的注册名称/要调用的函数', 参数)
      this.$store.commit('user/updateToken', result.data.token)
      // 3. 基于编程式导航的 API 跳转到后台主页 /
      this.$router.push('/')
    })
  }
}
</script>
<style lang="less" scoped>
.container-login {
  // 在 css 中也能使用 @ 表示 src 这一层路径，只不过要写出 ~@ 形式
  background: url('~@/assets/images/login_bg.jpg') no-repeat;
  background-size: cover;
  height: 100%;

  .box-login {
    width: 400px;
    height: 270px;
    background-color: #fff;
    border-radius: 3px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 0 25px;
    box-sizing: border-box;

    .box-login-title {
      height: 60px;
      background: url('~@/assets/images/login_title.png') no-repeat;
      background-position: center;
    }
  }
}
</style>
