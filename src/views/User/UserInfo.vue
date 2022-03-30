<template>
  <el-card class="box-card">
    <!-- 头部 -->
    <div slot="header" class="clearfix">
      <!-- 左侧的标题 -->
      <span>基本资料</span>
    </div>
    <!-- 表单 -->
    <el-form label-width="80px" :model="form" :rules="formRules" ref="formRef">
      <el-form-item label="登录名称">
        <el-input disabled v-model="form.username"></el-input>
      </el-form-item>
      <el-form-item label="用户昵称" prop="nickname">
        <el-input v-model="form.nickname"></el-input>
      </el-form-item>
      <el-form-item label="用户邮箱" prop="email">
        <el-input v-model="form.email"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="updateUser">提交修改</el-button>
        <el-button @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { Form } from 'element-ui'
import request from '@/utils/request'
@Component({})
export default class UserInfo extends Vue {
  // 数据对象
  // 把全局 getters 中的数据对象,拿到组件中,绑定为表单的数据对象
  // 浅拷贝的操作
  form = { ...this.$store.getters.userinfo }
  // 验证规则对象
  formRules = {
    nickname: [
      // 必填项
      { required: true, message: '昵称是必填项', trigger: 'blur' },
      // 正则校验
      { pattern: /^\S{1,10}$/, message: '昵称必须是1-10位的非空字符', trigger: 'blur' }
    ],
    email: [
      // 必填项
      { required: true, message: '邮箱是必填项', trigger: 'blur' },
      // 邮箱格式
      { type: 'email', message: '请输入正确的邮箱', trigger: 'blur' }
    ]
  }

  // 点击按钮,重置表单数据
  reset () {
    // 必须拿着 el-form 的引用对象，
    // 才可以调用到 resetFields 函数
    // 注意：resetFields 只会把表单数据，重置成刚进入页面时候的样子
    (this.$refs.formRef as Form).resetFields()
    // 重新把 vuex 中 getter 的数据，赋值给 form 数据对象
    this.form = { ...this.$store.getters.userinfo }
  }

  // 更新用户的基本信息
  updateUser () {
    // 1. 拿到 el-form 的 ref 引用，对整个表单数据进行校验
    // 2. 校验通过后，封装并调用 API 接口
    // 3. 接口调用成功后，要提升用户，并且刷新用户的信息
    (this.$refs.formRef as Form).validate(async (valid:boolean) => {
      // 如果验证不通过，则 return 出去，后面代码就不执行啦
      if (!valid) return
      // 调用 API 接口
      const result = await request.put('/my/userinfo', {
        id: this.form.id,
        nickname: this.form.nickname,
        email: this.form.email
      })

      // 提示用户成功啦
      this.$message.success(result.data.message)
      // 刷新页面上用户的数据
      // 要做的事儿：调用全局的、获取用户信息的 actions 函数即可
      this.$store.dispatch('user/initUserInfo')
    })
  }
}
</script>

<style lang="less" scoped>
.el-form {
  width: 500px;
}
</style>
