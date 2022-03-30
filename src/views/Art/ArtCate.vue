<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix header-box">
        <span>文章分类</span>
        <!-- 点击按钮，展示添加的对话框 -->
        <el-button type="primary" size="mini" @click="addVisible = true">添加分类</el-button>
      </div>
      <!-- 表格 -->
      <!-- :data="数据源" -->
      <el-table :data="catelist" border stripe>
        <!-- 序号列是固定写法，只需要提供 type="index" 即可 -->
        <el-table-column label="序号" type="index"></el-table-column>
        <el-table-column label="分类名称" prop="cate_name"></el-table-column>
        <el-table-column label="分类别名" prop="cate_alias"></el-table-column>
        <el-table-column label="操作">
          <!-- 插槽 -->
          <!-- 把普通插槽，升级成"作用域插槽"，就可以拿到这一行的数据对象啦 -->
          <!-- 注意：obj 对象上的 .row 属性，就是这一行对应的数据对象 -->
          <!-- 作用域插槽概念：带数据的插槽，就是作用域插槽 -->
          <!-- 我们在 v-slot:default="" 中，只能被动接收 el-table-column 对外提供的数据 -->
          <template v-slot="{ row }">
            <el-button type="primary" size="mini" @click="showEditDialog(row)">修改</el-button>
            <el-button type="danger" size="mini" @click="remove(row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 添加分类的对话框 -->
    <el-dialog title="添加文章分类" :visible.sync="addVisible" width="35%" @closed="onAddClosed">
      <!-- 添加分类的表单 -->
      <el-form label-width="80px" :model="addForm" :rules="addFormRules" ref="addFormRef">
        <el-form-item label="分类名称" prop="cate_name">
          <el-input v-model="addForm.cate_name" />
        </el-form-item>
        <el-form-item label="分类别名" prop="cate_alias">
          <el-input v-model="addForm.cate_alias" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="addVisible = false">取 消</el-button>
        <el-button size="mini" type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改分类的对话框 -->
    <!-- 在点击 el-dialog 对话框右上角关闭按钮的时候，el-dialog 内部，调用了 $emit() -->
    <!-- this.$emit('update:visible', false) -->
    <el-dialog title="修改文章分类" :visible.sync="editVisible" width="35%" @closed="onEditClosed">
      <!-- 表单 -->
      <el-form label-width="80px" :model="editForm" :rules="addFormRules" ref="editFormRef">
        <el-form-item label="分类名称" prop="cate_name">
          <el-input v-model="editForm.cate_name" />
        </el-form-item>
        <el-form-item label="分类别名" prop="cate_alias">
          <el-input v-model="editForm.cate_alias" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="editVisible = false">取 消</el-button>
        <el-button size="mini" type="primary" @click="editCate">确 定</el-button>
      </span>
    </el-dialog>

    <p>customVisible 的值是：{{ customVisible }}</p>
    <el-button type="primary" size="mini" @click="customVisible = true">展示自定义的对话框</el-button>
    <!-- 3. 使用自定义的子组件 -->
    <!-- <MyDialog :visible.sync="customVisible"></MyDialog> -->
  </div>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import request from '@/utils/request'
import { Form } from 'element-ui'
import type { AddForm, EditForm } from '@/types/art'
@Component({})
export default class ArtCate extends Vue {
  // 默认隐藏自定义的对话框
  customVisible = false
  // 文章的分类列表数据
  catelist = Array<EditForm>()
  // 这个布尔值，用来控制添加对话框的展示与隐藏
  addVisible = false
  // 添加表单的数据对象
  addForm:AddForm = {
    cate_name: '',
    cate_alias: ''
  }

  // 添加表单的验证规则对象
  addFormRules = {
    cate_name: [
    // 必填项
      { required: true, message: '分类名称是必填项', trigger: 'blur' },
      // 正则校验
      { pattern: /^\S{1,10}$/, message: '分类名称必须是1-10位的非空字符', trigger: 'blur' }
    ],
    cate_alias: [
    // 必填项
      { required: true, message: '分类别名是必填项', trigger: 'blur' },
      // 正则校验
      { pattern: /^[a-zA-Z0-9]{1,15}$/, message: '分类别名必须是1-15位的字母数字', trigger: 'blur' }
    ]
  }

  // 控制修改对话框的展示与隐藏
  editVisible = false
  // 修改表单的数据对象
  editForm:EditForm = {
    id: '',
    cate_name: '',
    cate_alias: ''
  }

  created () {
    // 组件一创建，就自动调用 initCateList 函数，发起 Ajax 请求
    this.initCateList()
  }

  // 获取文章列表数据的函数
  async initCateList () {
    const result = await request.get('/my/cate/list')
    console.log(result)
    // 把请求到的数据，转存到 data 中，供页面使用
    this.catelist = result.data.data
  }

  // 添加分类
  addCate () {
    // 1. 通过 ref 对添加表单的数据进行验证
    // 2. 验证通过后，要封装并调用添加分类的接口
    // 3. 添加成功之后，要做3件事儿：
    // 3.1 关闭对话框
    // 3.2 提示用户成功了
    // 3.3 刷新表格中的分类数据
    (this.$refs.addFormRef as Form).validate(async valid => {
      if (!valid) return
      // 调用接口
      const result = await request.post('/my/cate/add', this.addForm)
      // 成功了，要做3件事儿
      this.addVisible = false
      this.$message.success(result.data.message)
      this.initCateList()
    })
  }

  // 添加对话框关闭完成后的处理函数
  onAddClosed () {
    // 重置表单
    (this.$refs.addFormRef as Form).resetFields()
  }

  // 点击修改按钮，展示修改的对话框
  showEditDialog (row:EditForm) {
    if (row.id === '1' || row.id === '2') return this.$message.error('管理员不允许修改前两个分类！')

    // 把当前行的数据，回显到修改的表单中
    this.editForm = { ...row }
    // 注意：id 为 1 和 2 的分类，不允许被修改
    this.editVisible = true
  }

  // 监听修改对话框关闭的事件
  onEditClosed () {
    // 实现了修改表单的重置操作
    (this.$refs.editFormRef as Form).resetFields()
  }

  // 点击按钮，修改文章分类
  editCate () {
    // 1. 使用 ref，对修改的表单进行验证
    // 2. 验证通过后，封装并调用修改的接口
    // 3. 修改成功后，要做以下三件事：
    // 3.1 关闭对话框
    // 3.2 提示用户成功
    // 3.3 刷新列表数据

    (this.$refs.editFormRef as Form).validate(async valid => {
      if (!valid) return
      // 调用接口
      const result = await request.put('/my/cate/info', this.editForm)
      // 修改成功
      this.editVisible = false
      this.$message.success(result.data.message)
      this.initCateList()
    })
  }

  // 根据 id 删除文章分类
  async remove (id: number) {
    // 1. 提示用户是否要删除
    // 2. 当确认删除之后，封装并调用删除的 API
    // 3. 删除成功之后，做两件事：
    // 3.1 提示用户删除成功
    // 3.2 刷新列表数据

    if (id === 1 || id === 2) return this.$message.error('管理员不允许删除前两个分类！')

    const result = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).catch(err => err)

    // 用户点击了取消
    if (result === 'cancel') return

    // 用户点击了确定，需要调用删除的接口
    const res = await request.delete('/my/cate/del?id=' + id)
    this.$message.success(res.data.message)
    this.initCateList()
  }
}
</script>
<style lang="less" scoped>
.header-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
