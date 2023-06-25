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

// // 添加全局前置守卫
// router.beforeEach((to, from, next) => {
//   // 如果路由配置中没有定义标题，则使用默认标题
//   document.title = to.meta.title || '在线书城';

//   if (to.path === '/' || to.path == '/register') {
//     next()
//   } else {
//     try {
//       const token = window.localStorage.getItem('token')
//       if (token === '') {
//         // 如果检查不通过，可以阻止跳转或者重定向到其他页面
//         Message.info('你必须先登录！')
//         next('/')
//       } else {
//         const type = window.localStorage.getItem('type')
//         // 检查用户类型
//         if (to.path == '/system' && type == 1) {
//           Message.info('你没有权限访问系统部分！')
//           next(from.path)
//         } else {
//           next(to.path)
//         }
//       }
//     } catch (error) {
//       // 处理错误情况
//       console.error(error);
//       next(from.path);
//     }
//   }
// });

export default router