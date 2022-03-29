<template>
  <div class="container-reg">
    <div class="box-reg">
      <div class="box-reg-title"></div>
      <!-- 注册的表单 -->
      <!-- 2. 需要给 el-form 绑定两个属性 -->
      <!-- 2.1 绑定 :model="表单数据对象" -->
      <!-- 2.2 绑定 :rules="表单验证对象" -->
      <!-- 注意，在使用 ref 的时候，起名字很有讲究，推荐的命名方式 xxxRef -->
      <el-form :model="regForm" :rules="regFormRules" ref="regFormRef">
        <!-- 用户名的 item 项 -->
        <!-- 3. 为 el-form-item 标签，添加 prop 属性，用来指定具体的校验规则 -->
        <el-form-item prop="username">
          <!-- prefix-icon 表示前置图标 -->
          <el-input placeholder="请输入用户名" prefix-icon="el-icon-user" v-model="regForm.username"></el-input>
        </el-form-item>
        <!-- 密码的 item 项 -->
        <el-form-item prop="password">
          <el-input placeholder="请输入密码" type="password" v-model="regForm.password">
            <!-- 插槽的节点 -->
            <!-- prefix 表示前置的插槽 -->
            <!-- suffix 表示后置的插槽 -->
            <!-- 下面这行代码，表示的含义： -->
            <!-- 把 i 元素，放到名字为 prefix 的 slot 插槽中显示 -->
            <!-- 注意：slot="插槽的名字" 是 vue2 的旧语法，在 vue3 中不受支持 -->
            <i slot="prefix" class="el-input__icon el-icon-lock"></i>
          </el-input>
        </el-form-item>
        <!-- 确认密码的 item 项 -->
        <el-form-item prop="repassword">
          <el-input placeholder="请再次确认密码" type="password" v-model="regForm.repassword">
            <!-- v-slot:插槽的名字 -->
            <!-- # 是 v-slot: 的简写形式 -->
            <!-- template 是一个虚拟元素 -->
            <template v-slot:prefix>
              <i class="el-input__icon el-icon-lock"></i>
            </template>
          </el-input>
        </el-form-item>
        <!-- 注册按钮的 item 项 -->
        <el-form-item>
          <el-button type="primary" style="width: 100%">注册</el-button>
          <!-- $router 是路由导航对象，里面提供了编程式导航的各种 API 函数 -->
          <el-link type="info" @click="$router.push('/login')">去登录</el-link>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import type { RegForm } from '@/types/reg'
@Component({})
export default class Reg extends Vue {
  // 注册的表单数据，将来我们会把 regForm 作为请求体，提交给服务器
  regForm: RegForm = {
    username: '',
    password: '',
    repassword: ''
  };

  // 1. 在 data 中，定义表单的校验规则对象
  // 建议大家，给校验规则对象，命名的时候，遵守的规则 xxxRules
  regFormRules = {
    // 要校验哪个数据，就把数据的名字，作为校验规则的名字
    // 校验规则的名字: [ 一个一个的校验规则 ]
    username: [
      // 必填项的校验规则
      // required: true 表示必填项
      // message 是错误的提示消息
      // trigger 是触发校验的时机，其中 blur 表示文本框失去焦点的时候，进行校验
      // 文本框的 trigger 一般都是 'blur'；如果是下拉框，则 trigger 一般都是 'change'
      { required: true, message: '用户名是必填项', trigger: 'blur' },
      // 正则校验
      // pattern: 正则表达式
      { pattern: /^[a-zA-Z0-9]{1,10}$/, message: '用户名必须是1-10位的字母数字', trigger: 'blur' }
    ],
    password: [
      // 必填项的校验
      { required: true, message: '密码是必填项', trigger: 'blur' },
      // 正则校验
      { pattern: /^\S{6,15}$/, message: '密码必须是6-15位的非空字符串', trigger: 'blur' }
    ],
    repassword: [
      // 必填项的校验
      { required: true, message: '确认密码是必填项', trigger: 'blur' },
      // 正则校验
      { pattern: /^\S{6,15}$/, message: '确认密码必须是6-15位的非空字符串', trigger: 'blur' },
      // 校验两次密码是否一致
      // { validator: 自定义的校验规则, trigger: 触发校验的时机 }
      // { validator: samePwd, trigger: 'blur' }
      {
        validator: (rule:any, value:string, cb: any) => {
          if (value === this.regForm.password) {
            // 两次密码一致，校验通过
            cb()
          } else {
            cb(new Error('两次密码不一致！'))
          }
        },
        trigger: 'blur'
      }
    ]
  };
}
</script>

<style lang="less" scoped>
.container-reg {
  // 在 css 中也能使用 @ 表示 src 这一层路径，只不过要写出 ~@ 形式
  background: url('~@/assets/images/login_bg.jpg') no-repeat;
  background-size: cover;
  height: 100%;

  .box-reg {
    width: 400px;
    height: 335px;
    background-color: #fff;
    border-radius: 3px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 0 25px;
    box-sizing: border-box;

    .box-reg-title {
      height: 60px;
      background: url('~@/assets/images/login_title.png') no-repeat;
      background-position: center;
    }
  }
}
</style>
