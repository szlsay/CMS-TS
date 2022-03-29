<template>
  <el-container class="main-container">
    <!-- 头部区域 -->
    <el-header>
      <!-- 左侧的 logo -->
      <img src="../../assets/images/logo.png" alt="" />
      <!-- 右侧的菜单 -->
      <el-menu
        class="el-menu-top"
        mode="horizontal"
        background-color="#23262E"
        text-color="#fff"
        active-text-color="#409EFF"
      >
        <el-submenu index="1">
          <template slot="title">
            <!-- 头像 -->
            <!-- 如果 userinfo.user_pic 值为 null，则渲染默认的头像 -->
            <!-- 否则，就把 userinfo.user_pic 绑定给 img 标签的 src 属性即可 -->
            <img src="../../assets/logo.png" alt="" class="avatar" v-if="userinfo.user_pic === null" />
            <img :src="userinfo.user_pic" alt="" class="avatar" v-else />
            <span>个人中心</span>
          </template>
          <el-menu-item index="1-1" @click="$router.push('/user-info')"
            ><i class="el-icon-s-operation"></i>基本资料</el-menu-item
          >
          <el-menu-item index="1-2" @click="$router.push('/user-avatar')"
            ><i class="el-icon-camera"></i>更换头像</el-menu-item
          >
          <el-menu-item index="1-3" @click="$router.push('/user-pwd')"
            ><i class="el-icon-key"></i>重置密码</el-menu-item
          >
        </el-submenu>
        <el-menu-item index="2" @click="logout"><i class="el-icon-switch-button"></i>退出</el-menu-item>
      </el-menu>
    </el-header>
    <!-- 内容主体区域 -->
    <el-container>
      <!-- 左侧边栏区域 -->
      <el-aside width="200px">
        <!-- 头像区域 -->
        <div class="user-box">
          <img src="../../assets/logo.png" alt="" v-if="userinfo.user_pic === null" />
          <img :src="userinfo.user_pic" alt="" v-else />
          <span>欢迎 {{ userinfo.nickname || userinfo.username }}</span>
        </div>
        <!-- 菜单区域 -->
        <!-- :router="true" 表示开启路由模式，点击菜单项，会跳转到 index 属性对应的地址 -->
        <!-- default-active 表示默认的激活项，它的值应该是 index 的值 -->
        <el-menu
          :default-active="$route.path"
          class="el-menu-vertical-demo"
          background-color="#23262E"
          text-color="#fff"
          active-text-color="#409EFF"
          unique-opened
          router
        >
          <!-- 循环 template 虚拟元素，每循环一次，创建一个一级菜单 -->
          <!-- template 身上，无法绑定 key 值，需要把 key 值绑定给真正的 DOM 元素 -->
          <template v-for="item in menus">
            <!-- 不包含子菜单的“一级菜单” -->
            <el-menu-item :index="item.indexPath" v-if="item.children === null" :key="item.indexPath">
              <i :class="item.icon"></i>
              {{ item.title }}
            </el-menu-item>
            <!-- 包含子菜单的“一级菜单” -->
            <el-submenu :index="item.indexPath" v-else :key="item.indexPath">
              <template slot="title">
                <i :class="item.icon"></i>
                <span>{{ item.title }}</span>
              </template>
              <!-- 循环生成二级菜单 -->
              <el-menu-item :index="subItem.indexPath" v-for="subItem in item.children" :key="subItem.indexPath">
                <i :class="subItem.icon"></i>
                {{ subItem.title }}
              </el-menu-item>
            </el-submenu>
          </template>
        </el-menu>
      </el-aside>
      <el-container>
        <!-- 页面主体区域 -->
        <el-main>
          <!-- 子路由的占位符 -->
          <router-view></router-view>
        </el-main>
        <!-- 底部 footer 区域 -->
        <el-footer>© www.say.com</el-footer>
      </el-container>
    </el-container>
  </el-container>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import type { Menus } from '@/types/main'
import request from '@/utils/request'
@Component({})
export default class Main extends Vue {
  // 左侧菜单的列表数据
  menus = Array<Menus>()

  // 计算属性
  // 2. 结合计算属性，调用 mapGetters 辅助函数，
  // 把需要的 getters 数据，拿到组件中使用
  // 注意：我们提供的快捷访问，是全局的 getters，因此，不需要加模块的注册名称
  // ...mapGetters('模块的注册名称', ['模块内部的getter数据'])
  get userinfo () {
    return this.$store.getters.userinfo
  }

  created () {
    // 调用 vuex 中的 actions 函数，获取用户的基本信息
    this.$store.dispatch('user/initUserInfo')
    // 调用 methods 里面的 initMenus 函数，发请求获取菜单数据
    this.initMenus()
  }

  // 初始化左侧菜单的列表数据
  async initMenus () {
    const result = await request.get('/my/menus')
    // 只要 Ajax 请求回来的数据，需要在组件渲染期间被使用，
    // 则必须把请求到的数据，转存到 data 中，供页面使用
    console.log(result)
    this.menus = result.data.data
  }

  // 退出登录
  async logout () {
    // 询问用户是否确认退出登录
    const result = await this.$confirm('您确认退出登录吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).catch(err => err)

    // 如果 result 值是 confirm 表示点击了确认
    // 如果 result 值是 cancel 表示点击了取消
    if (result === 'cancel') return

    // 1. 清空 token 和 info 对象
    this.$store.commit('user/updateToken', '')
    this.$store.commit('user/updateInfo', {})
    // 2. 跳转到登录页面
    this.$router.push('/login')
  }
}
</script>

<style lang="less" scoped>
.main-container {
  height: 100%;
  .el-header,
  .el-aside {
    background-color: #23262e;
  }
  .el-header {
    padding: 0;
    display: flex;
    justify-content: space-between;
  }
  .el-main {
    overflow-y: scroll;
    height: 0;
    background-color: #f2f2f2;
  }
  .el-footer {
    background-color: #eee;
    font-size: 12px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}

.avatar {
  border-radius: 50%;
  width: 35px;
  height: 35px;
  background-color: #fff;
  margin-right: 10px;
  object-fit: cover;
}

// 左侧边栏用户信息区域
.user-box {
  height: 70px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-top: 1px solid #000;
  border-bottom: 1px solid #000;
  user-select: none;
  img {
    width: 35px;
    height: 35px;
    border-radius: 50%;
    background-color: #fff;
    margin-right: 15px;
    object-fit: cover;
  }
  span {
    color: white;
    font-size: 12px;
  }
}

// 侧边栏菜单的样式
.el-aside {
  .el-submenu,
  .el-menu-item {
    width: 200px;
    user-select: none;
  }
}
</style>
