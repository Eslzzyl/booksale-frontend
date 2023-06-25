<template>
  <div class="layout">
    <!--用一行容纳两列-->
    <Row type="flex">
      <!--左侧的导航页-->
      <Col span="5" class="layout-menu-left">
      <Menu active-name="1-1" theme="dark" width="auto" :open-names="['1']">
        <div class="layout-logo-left">
          <h2 style="color:white;">在线书城-管理端</h2>
        </div>
        <Submenu name="1">
          <div class="welcome">
            <Space>
              <Icon type="ios-navigate" />
              <span>欢迎你，管理员 {{ username }}</span>
            </Space>
          </div>
          <MenuItem name="1-1" @click.native="manageBook"><span>书籍管理</span></MenuItem>
          <MenuItem name="1-2" @click.native="lookRecord"><span>销售记录</span></MenuItem>
        </Submenu>
      </Menu>
      </Col>
      <!--右侧的内容页-->
      <Col span="19">
      <!--这个header没什么用，先注释了-->
      <!--<div class="layout-header"></div>-->
      <div class="layout-breadcrumb">
        <Breadcrumb>
          <BreadcrumbItem href="#">{{ one_nav }}</BreadcrumbItem>
          <BreadcrumbItem>{{ two_nav }}</BreadcrumbItem>
          <Button id="system" @click="system">转到系统管理</Button>
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
import ManageBook from './manager/ManageBook.vue'
import SellRecord from './manager/SellRecord.vue'
import { Button } from 'view-ui-plus'

export default {
  name: 'Manager',
  data() {
    return {
      username: '',
      one_nav: '主页',
      two_nav: '书籍管理',
      currentView: 'ManageBook',
      logoutModal: false,
    }
  },
  mounted() {
    this.username = window.localStorage.getItem('contact')
  },
  methods: {
    updateToken(value) {
      window.localStorage.setItem('token', value)
    },
    manageBook() {
      this.one_nav = '主页'
      this.two_nav = '书籍管理'
      this.currentView = 'ManageBook'
    },
    lookRecord() {
      this.one_nav = '主页'
      this.two_nav = '销售记录'
      this.currentView = 'SellRecord'
    },
    // 用户确认登出，清除token信息并返回到登录页面
    logoutModalConfirmed() {
      this.updateToken('')
      this.$Message.info('已登出')
      this.$router.replace('/')
    },
    // 转到系统管理
    system() {
      this.$router.replace('/system')
    }
  },
  components: {
    Button,
    ManageBook: ManageBook,
    SellRecord: SellRecord,
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

#system {
  position: absolute;
  right: 15%;
}

/* 退出按钮 */
#logout {
  position: absolute;
  right: 5%;
}
</style>
