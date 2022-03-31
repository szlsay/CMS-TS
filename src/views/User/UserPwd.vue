<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>重置密码</span>
    </div>
    <!-- 表单 -->
    <el-form label-width="85px" :model="form" :rules="formRules" ref="formRef">
      <el-form-item label="原密码" prop="old_pwd">
        <el-input type="password" v-model="form.old_pwd" />
      </el-form-item>
      <el-form-item label="新密码" prop="new_pwd">
        <el-input type="password" v-model="form.new_pwd" />
      </el-form-item>
      <el-form-item label="确认新密码" prop="re_pwd">
        <el-input type="password" v-model="form.re_pwd" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="updatePwd">修改密码</el-button>
        <el-button @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import request from '@/utils/request'
import { Form } from 'element-ui'
@Component({})
export default class UserPwd extends Vue {
  // 表单的数据对象
  form = {
    old_pwd: '',
    new_pwd: '',
    re_pwd: ''
  }

  // 验证规则对象
  formRules = {
    old_pwd: [
      // 必填项
      { required: true, message: '旧密码不能为空', trigger: 'blur' },
      // 正则校验
      { pattern: /^\S{6,15}$/, message: '密码必须是6-15位的非空字符', trigger: 'blur' }
    ],
    new_pwd: [
      // 必填项
      { required: true, message: '新密码不能为空', trigger: 'blur' },
      // 正则校验
      { pattern: /^\S{6,15}$/, message: '密码必须是6-15位的非空字符', trigger: 'blur' },
      // 自定义校验规则：新密码的值，不能和原密码一样
      {
        validator: (rule:any, value:string, cb: (flag: Error | void) => void) => {
          // 拿着“新密码”和“原密码”的值，进行等号的判断
          // 1. 如果相等，应该报错
          // 2. 如果不相等，校验通过
          if (value === this.form.old_pwd) {
            cb(new Error('新旧密码不能相同！'))
          } else {
            cb()
          }
        },
        trigger: 'blur'
      }
    ],
    re_pwd: [
      // 必填项
      { required: true, message: '确认密码不能为空', trigger: 'blur' },
      // 正则校验
      { pattern: /^\S{6,15}$/, message: '密码必须是6-15位的非空字符', trigger: 'blur' },
      // 自定义校验规则：两次新密码必须一样
      {
        validator: (rule:any, value:string, cb: (flag: Error | void) => void) => {
          // 如果两次新密码一样了，则校验通过
          // 如果两次新密码不一样，则报错
          if (value === this.form.new_pwd) {
            cb()
          } else {
            cb(new Error('两次新密码不一致！'))
          }
        },
        trigger: 'blur'
      }
    ]
  }

  // 重置表单
  reset () {
    (this.$refs.formRef as Form).resetFields()
  }

  // 更新密码
  updatePwd () {
    // 1. 通过 ref 对表单数据进行验证
    // 2. 验证通过后，封装并调用 API 接口
    // 3. 接口调用成功后，提示用户更新密码成功
    (this.$refs.formRef as Form).validate(async (valid: boolean) => {
      // 校验不通过，直接 return
      if (!valid) return
      // 调用接口
      const result = await request.patch('/my/updatepwd', this.form)
      console.log(result)
      // 调用接口成功后，提示用户成功的消息
      this.$message.success(result.data.message)
    })
  }
}
</script>

<style lang="less" scoped>
.el-form {
  width: 500px;
}
</style>
