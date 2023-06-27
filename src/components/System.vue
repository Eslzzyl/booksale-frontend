<template>
  <div class="layout">
    <!--用一行容纳两列-->
    <Row type="flex">
      <!--左侧的导航页-->
      <Col span="5" class="layout-menu-left">
      <Menu active-name="1-1" theme="dark" width="auto" :open-names="['1']">
        <div class="layout-logo-left">
          <h2 style="color:white;">在线书城-系统管理</h2>
        </div>
        <Submenu name="1">
          <div class="welcome">
            <Space>
              <Icon type="ios-navigate" />
              <span>欢迎你，系统管理员 {{ username }}</span>
            </Space>
          </div>
          <MenuItem name="1-1" @click.native="getRecords"><span>销售记录表</span></MenuItem>
          <MenuItem name="1-2" @click.native="getBooks"><span>书籍表</span></MenuItem>
          <MenuItem name="1-3" @click.native="getSuppliers"><span>供应商表</span></MenuItem>
          <MenuItem name="1-4" @click.native="getPublishers"><span>出版社表</span></MenuItem>
          <MenuItem name="1-5" @click.native="getHottest"><span>热门书籍表</span></MenuItem>
        </Submenu>
      </Menu>
      </Col>
      <!--右侧的内容页-->
      <Col span="19">
      <div class="layout-breadcrumb">
        <Breadcrumb>
          <BreadcrumbItem href="#">{{ one_nav }}</BreadcrumbItem>
          <BreadcrumbItem>{{ two_nav }}</BreadcrumbItem>
          <Button id="manage" @click="manage">转到后台管理</Button>
          <Button id="logout" type="primary" @click="logoutModal = true">退出登录</Button>
          <Modal v-model="logoutModal" title="确认登出" @on-ok="logoutModalConfirmed">
            <p>你真的要登出吗？</p>
          </Modal>
        </Breadcrumb>
      </div>
      <div class="layout-content">
        <div class="layout-content-main">
          <template id="searchBook"></template>
          <template id="myRecord"></template>
          <component :is="currentView"></component>
        </div>
      </div>
      <div class="layout-copy">
        2023 &copy; InnoSpace
      </div>
      </Col>
    </Row>
  </div>
</template>
  
<script>
import Books from './system/Books.vue'
import Record from './system/Record.vue'
import Suppliers from './system/Suppliers.vue'
import Publishers from './system/Publishers.vue'
import Hottest from './system/Hottest.vue'
import { Button } from 'view-ui-plus'

export default {
  name: 'Manager',
  data() {
    return {
      username: '',
      one_nav: '主页',
      two_nav: '销售记录',
      currentView: 'Record',
      logoutModal: false,
    }
  },
  mounted() {
    this.username = window.localStorage.getItem('contact')
    this.getRecords()
  },
  methods: {
    updateToken(value) {
      window.localStorage.setItem('token', value)
    },
    // 转到后台管理
    manage() {
      this.$router.replace('/manager')
    },
    // 用户确认登出，清除token信息并返回到登录页面
    logoutModalConfirmed() {
      window.localStorage.clear()
      this.$Message.info('已登出')
      this.$router.replace('/')
    },
    getSuppliers() {
      this.one_nav = '主页'
      this.two_nav = '书籍管理'
      this.currentView = 'Suppliers'
    },
    getBooks() {
      this.one_nav = '主页'
      this.two_nav = '书表'
      this.currentView = 'Books'
    },
    getPublishers() {
      this.one_nav = '主页'
      this.two_nav = '出版商表'
      this.currentView = 'Publishers'
    },
    getRecords() {
      this.one_nav = '主页'
      this.two_nav = '销售记录'
      this.currentView = 'Record'
    },
    getHottest() {
      this.one_nav = '主页'
      this.two_nav = '热门书籍'
      this.currentView = 'Hottest'
    },
  },
  // 用户确认登出，清除token信息并返回到登录页面
  logoutModalConfirmed() {
    this.updateToken('')
    this.$Message.info('已登出')
    this.$router.replace('/')
  },
  components: {
    Button,
    Record,
    Books,
    Suppliers,
    Publishers,
    Hottest,
  }
}
</script>
  
<style scoped>
.layout {
  border: 1px solid #d7dde4;
  background: #f5f7f9;
  position: relative;
  margin-top: -60px;
}

.layout-breadcrumb {
  padding: 10px 15px 0;
  text-align: left;
}

.layout-content {
  min-height: 725px;
  margin: 15px;
  overflow: hidden;
  background: #fff;
  border-radius: 4px;
}

.layout-content-main {
  padding: 10px;
}

.layout-copy {
  text-align: center;
  padding: 10px 0 20px;
  color: #9ea7b4;
}

.layout-menu-left {
  background: #464c5b;
}

.layout-header {
  height: 60px;
  background: #fff;
  box-shadow: 0 1px 1px rgba(0, 0, 0, .1);
}

.layout-logo-left {
  width: 90%;
  height: 30px;
  background: #5b6270;
  border-radius: 3px;
  margin: 15px auto;
}

.welcome {
  color: azure;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50px;
}

/* 退出按钮 */
#logout {
  position: absolute;
  right: 5%;
}

/* 后台管理按钮 */
#manage {
  position: absolute;
  right: 15%;
}
</style>
  