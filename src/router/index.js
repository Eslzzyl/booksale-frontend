import { createRouter, createWebHistory } from 'vue-router'
import { inject } from 'vue'
import { Message } from 'view-ui-plus'
import Login from '@/components/Login.vue'
import User from '@/components/User.vue'
import Manager from '@/components/Manager.vue'
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
//   document.title = to.meta.title || '默认标题';

//   if (to.path === '/' || to.path == '/register') {
//     next()
//   } else {
//     try {
//       const token = inject('token')
//       if (token.value === '') {
//         // 如果检查不通过，可以阻止跳转或者重定向到其他页面
//         Message.info('你必须先登录！')
//         next('/')
//       } else {
//         // 检查通过，允许跳转到目标页面
//         next()
//       }
//     } catch (error) {
//       // 处理错误情况
//       console.error(error);
//       next('/');
//     }
//   }
// });

export default router