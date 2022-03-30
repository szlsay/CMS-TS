<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>文章列表</span>
      </div>
      <!-- 搜索区域 -->
      <div class="search-box">
        <el-form :inline="true" :model="q">
          <el-form-item label="文章分类">
            <el-select v-model="q.cate_id" placeholder="请选择分类" size="small">
              <!-- 循环生成分类的可选项 -->
              <el-option v-for="item in catelist" :key="item.id" :label="item.cate_name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="发布状态" style="margin-left: 15px">
            <el-select v-model="q.state" placeholder="请选择状态" size="small">
              <el-option label="已发布" value="已发布"></el-option>
              <el-option label="草稿" value="草稿"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="small" @click="search">筛选</el-button>
            <el-button type="info" size="small" @click="reset">重置</el-button>
          </el-form-item>
        </el-form>
        <!-- 发表文章的按钮 -->
        <el-button type="primary" size="small" class="btn-pub" @click="addVisible = true">发表文章</el-button>
      </div>

      <!-- 文章表格区域 -->
      <el-table :data="artlist" border stripe>
        <el-table-column label="文章标题">
          <template v-slot="{ row }">
            <el-link type="primary" @click="initArtDetail(row.id)">{{ row.title }}</el-link>
          </template>
        </el-table-column>
        <el-table-column label="文章分类" prop="cate_name"></el-table-column>
        <!-- 在 el-table-column 组件中，prop 的值，表示数据项的名字 -->
        <!-- 意思是：把对应数据项的名字，传递给 el-table-column 组件 -->
        <!-- 在每个 el-table-column 中，要想拿到当前行的数据，通过作用域插槽来拿 -->
        <el-table-column label="发表时间">
          <template v-slot="{ row }">{{ row.pub_date }}</template>
        </el-table-column>
        <el-table-column label="状态">
          <template v-slot="{ row }">
            <el-tag size="medium" v-if="row.state === '已发布'">已发布</el-tag>
            <el-tag size="medium" type="info" v-else>草稿</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template v-slot="{ row }">
            <el-button type="danger" size="mini" @click="remove(row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="q.pagenum"
        :page-sizes="[2, 3, 5, 10]"
        :page-size="q.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>

    <!-- 发表文章的对话框 -->
    <!-- :before-close="handleClose" 用来提醒用户，如果关闭了，则辛苦填写的数据，就丢失啦，给用户一个反悔的机会 -->
    <!-- 注意：为 Dialog 加上了 before-close 之后，点击“❌”的时候，需要用户自定义关闭的行为 -->
    <el-dialog
      title="发表文章"
      :visible.sync="addVisible"
      fullscreen
      :before-close="handleClose"
      @closed="onDialogClosed"
    >
      <!-- 发表文章的表单 -->
      <el-form label-width="80px" :model="form" :rules="formRules" ref="formRef">
        <el-form-item label="文章标题" prop="title">
          <el-input placeholder="请输入标题" v-model="form.title" />
        </el-form-item>
        <el-form-item label="文章分类" prop="cate_id">
          <el-select placeholder="请选择分类" v-model="form.cate_id">
            <el-option :label="item.cate_name" :value="item.id" v-for="item in catelist" :key="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="文章内容" prop="content">
          <!-- 富文本编辑器 -->
          <quill-editor v-model="form.content" @blur="onEditorBlur" />
        </el-form-item>
        <el-form-item label="文章封面" prop="cover_img">
          <!-- 用来显示封面的图片 -->
          <!-- imgURL 是图片的路径，不是 base64 -->
          <img :src="imgURL" alt="" class="cover-img" v-if="imgURL" />
          <img src="@/assets/images/cover.jpg" alt="" class="cover-img" v-else />
          <br />
          <!-- 文件选择框，默认被隐藏 -->
          <input type="file" style="display: none" accept="image/*" ref="iptFileRef" @change="onFileChange" />
          <!-- 选择封面的按钮 -->
          <el-button type="text" @click="$refs.iptFileRef.click()">+ 选择封面</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="pub('已发布')">发布</el-button>
          <el-button type="info" @click="pub('草稿')">存为草稿</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!-- 查看文章详情的对话框 -->
    <el-dialog title="文章预览" :visible.sync="detailVisible" width="80%">
      <h1 class="title">{{ artDetail.title }}</h1>

      <div class="info">
        <span>作者：{{ artDetail.nickname || artDetail.username }}</span>
        <span>发布时间：{{ artDetail.pub_date }}</span>
        <span>所属分类：{{ artDetail.cate_name }}</span>
        <span>状态：{{ artDetail.state }}</span>
      </div>

      <!-- 分割线 -->
      <el-divider></el-divider>

      <!-- 文章的封面 -->
      <img :src="'http://www.liulongbin.top:3008' + artDetail.cover_img" alt="" />

      <!-- 文章的详情 -->
      <div v-html="artDetail.content" class="detail-box"></div>
    </el-dialog>
  </div>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import request from '@/utils/request'
import { Form } from 'element-ui'
import type { ListForm } from '@/types/art'
@Component({})
export default class ArtList extends Vue {
  // 查询参数对象
  q = {
    // 页码值
    pagenum: 1,
    // 每页显示多少条数据（页容量）
    pagesize: 2,
    // 文章分类的 id
    cate_id: '',
    // 文章的发表状态
    state: ''
  }

  // 控制发表文章对话框的展示和隐藏
  addVisible = false
  // 表单的数据对象
  form: ListForm = {
    // 文章的标题
    title: '',
    // 文章所属分类的 id
    cate_id: '',
    // 文章的内容
    content: '',
    // 文章的发表状态
    state: '',
    // 文章的封面
    cover_img: ''
  }

  // 验证规则对象
  formRules = {
    title: [
      // 必填项
      { required: true, message: '标题是必填项', trigger: 'blur' },
      // 正则校验
      { pattern: /^.{1,30}$/, message: '文章标题必须是1-30个字符', trigger: 'blur' }
    ],
    cate_id: [
      // 必填项
      { required: true, message: '分类是必选项', trigger: 'change' }
    ],
    content: [
      // 必填项
      { required: true, message: '内容是必填项', trigger: 'blur' }
    ],
    cover_img: [
      // 必填项
      { required: true, message: '封面是必填项', trigger: 'blur' }
    ]
  }

  // 所有的文章分类数据
  catelist = []
  // 要显示的文章封面的存放路径
  imgURL = ''
  // 文章的列表数据
  artlist = []
  // 总数据条数
  total = 0
  // 文章的详情数据
  artDetail = {}
  // 控制详情对话框的显示和隐藏
  detailVisible = false

  created () {
    // 初始化分类列表的数据
    this.initCateList()
    this.initArtList()
  }

  // 获取文章分类的列表数据
  async initCateList () {
    const result = await request.get('/my/cate/list')
    this.catelist = result.data.data
  }

  // 初始化文章的列表数据
  async initArtList () {
    const result = await request.get('/my/article/list', {
      // params 所指向的才是真正的查询参数对象
      params: this.q
    })
    console.log(result)
    this.artlist = result.data.data
    this.total = result.data.total
  }

  // 关闭之前的处理函数，可以询问用户是否确认关闭
  async handleClose (done:any) {
    const result = await this.$confirm('此操作将导致文章信息丢失, 是否继续?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).catch(err => err)

    if (result === 'cancel') {
      // 点击了取消，不想关闭
      done(false)
    } else {
      done()
    }
  }

  // 富文本编辑器失去焦点的时候，触发这个函数
  onEditorBlur () {
    // 手动触发富文本编辑器的校验规则
    // this.$refs.formRef.validateField('要校验的数据的名字', fn)
    (this.$refs.formRef as Form).validateField('content')
  }

  // 选中的文件发生了变化
  onFileChange (e:any) {
    // 获取用户选择的文件，是一个伪数组
    const files = e.target.files
    if (files.length !== 0) {
      // 如果伪数组的 length 不为 0，证明选中了封面
      console.log(files[0])
      // 1. 把用户选中的文件，显示到页面上
      // const 文件的存放路径 = URL.createObjectURL(文件)
      this.imgURL = URL.createObjectURL(files[0])
      // 2. 把用户选中的文件，保存到 form.cover_img 中
      this.form.cover_img = files[0]
    }
  }

  // 监听对话框关闭的事件
  onDialogClosed () {
    // 重置表单数据
    const formRef = this.$refs.formRef as Form
    formRef.resetFields()
    // 清空图片的URL地址
    this.imgURL = ''
    // 重置状态
    this.form.state = ''
    // 手动移除“文章内容”的校验结果
    formRef.clearValidate('content')
  }

  // 点击按钮，发表文章
  pub (state:string) {
    // 动态设置文章的发表状态
    this.form.state = state
    // 通过 ref 验证表单数据的合法性
    // 封装接口，发表文章
    // 成功以后，做3件事儿：
    // 1. 关闭对话框
    // 2. 提示用户成功
    // 3. 刷新文章列表数据
    const formRef = this.$refs.formRef as Form
    formRef.validate(async (valid:boolean) => {
      if (!valid) return
      // 把对象格式的数据，转换成 FormData 格式的数据
      const fd = new FormData()
      for (const [key, value] of Object.entries(this.form)) {
        console.log(key, value)
        fd.append(key, value)
      }
      // 调用接口
      const result = await request.post('/my/article/add', fd)
      // 成功了
      this.addVisible = false
      this.$message.success(result.data.message)
      this.initArtList()
    })
  }

  // 选中的页容量发生了变化
  handleSizeChange (newSize: number) {
    console.log('页容量发生了变化', newSize)
    this.q.pagesize = newSize
    // 每次页容量变化，都要重置页码值为 1
    // 防止获取到的数据为空的问题
    this.q.pagenum = 1
    this.initArtList()
  }

  // 选中的页码值发生了变化
  handleCurrentChange (newPage:number) {
    console.log('页码值发生了变化', newPage)
    this.q.pagenum = newPage
    this.initArtList()
  }

  // 筛选
  search () {
    this.q.pagenum = 1
    this.q.pagesize = 2
    this.initArtList()
  }

  // 重置
  reset () {
    this.q.pagenum = 1
    this.q.pagesize = 2
    this.q.cate_id = ''
    this.q.state = ''
    this.initArtList()
  }

  // 获取文章详情数据
  async initArtDetail (id:string) {
    const result = await request.get('/my/article/info?id=' + id)
    this.artDetail = result.data
    this.detailVisible = true
  }

  // 删除文章
  async remove (id:string) {
    const result = await this.$confirm('此操作将永久删除该文章, 是否继续?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).catch(err => err)

    if (result === 'cancel') return

    // 调用接口
    const res = await request.delete('/my/article/info?id=' + id)
    this.$message.success(res.data.message)
    // artlist.length
    if (this.artlist.length === 1 && this.q.pagenum > 1) {
      this.q.pagenum--
    }
    this.initArtList()
  }
}
</script>
<style lang="less" scoped>
.search-box {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  .btn-pub {
    margin-top: 5px;
  }
}

.el-select {
  width: 100%;
}

/deep/ .ql-editor {
  min-height: 300px;
}

// 解决元素对齐问题
/deep/ .ql-snow .ql-picker-label::before {
  position: relative;
  top: -8px;
}

// 解决元素对齐问题
/deep/ .ql-picker-label > svg {
  position: relative;
  top: -6px;
}

// 设置图片封面的宽高
.cover-img {
  width: 400px;
  height: 280px;
  object-fit: cover;
}

.el-pagination {
  margin-top: 15px;
}

.title {
  font-size: 24px;
  text-align: center;
  font-weight: normal;
  color: #000;
  margin: 0 0 10px 0;
}

.info {
  font-size: 12px;
  span {
    margin-right: 20px;
  }
}

// 修改 dialog 内部元素的样式，需要添加样式穿透
/deep/ .detail-box {
  img {
    width: 500px;
  }
}
</style>
