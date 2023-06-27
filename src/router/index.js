import { createRouter, createWebHistory } from 'vue-router'
import { Message } from 'view-ui-plus'
import Login from '@/components/Login.vue'
import User from '@/components/User.vue'
import Manager from '@/components/Manager.vue'
import System from '@/components/System.vue'
import Register from '@/components/Register.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'Login',
      component: Login,
      meta: {
        title: '登录',
      },
    },
    {
      path: '/user',
      component: User,
      meta: {
        title: '用户页',
      },
    },
    {
      path: '/manager',
      component: Manager,
      meta: {
        title: '管理页',
      },
    },
    {
      path: '/system',
      component: System,
      meta: {
        title: '系统管理',
      }
    },
    {
      path: '/register',
      component: Register,
      meta: {
        title: '注册',
      },
    }
  ]
})

// 添加全局前置守卫
router.beforeEach((to, from, next) => {
  // 如果路由配置中没有定义标题，则使用默认标题
  document.title = to.meta.title || '在线书城';

  next()
});

export default router