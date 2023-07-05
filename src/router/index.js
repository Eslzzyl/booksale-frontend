import { createRouter, createWebHashHistory } from 'vue-router'
import Login from '@/components/Login.vue'
import User from '@/components/User.vue'
import Manager from '@/components/Manager.vue'
import System from '@/components/System.vue'
import Register from '@/components/Register.vue'

const router = createRouter({
  history: createWebHashHistory(),
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

  if (to.path !== '/') {
    if (to.path === '/register') {
      next()
    } else {
      const token = localStorage.getItem('token')
      if (token === null || token === '') {
        next('/')
      } else {
        const userType = localStorage.getItem('type')
        if (userType === 'user') {
          if (to.path === '/manager' || to.path === '/system') {
            next('/user')
          } else {
            next()
          }
        } else {
          if (to.path === '/user') {
            next('/manager')
          } else {
            next()
          }
        }
      }
    }
  }
  next()
});

export default router