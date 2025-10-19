import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    redirect: '/entrance'
  },
  // {
  //   path: '/about',
  //   name: 'about',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  // }
  {
    path: '/entrance',
    name: 'entrance',
    component: () => import('../views/Entrance.vue'),
    meta: {
      title: '入口'
    }
  },
  {
    path: '/upload',
    name: 'upload',
    // component: () => import('../views/upload/Upload.vue'),
    component: () => import('../views/closed.vue'),
    meta: {
      title: '作品上传/修改'
    }
  },
  // {
  //   path: '/score',
  //   name: 'score',
  //   component: () => import('../views/score/List.vue'),
  //   meta: {
  //     title: '榜单查看'
  //   }
  // },
  {
    path: '/rate',
    name: 'rate',
    component: () => import('../views/rate/Rate.vue'),
    redirect: '/rate/index',
    children: [
      {
        path: '/rate/index',
        name: 'index',
        component: () => import('../views/rate/inRate/index.vue'),
        meta: {
          title: '评分首页'
        }
      },
      {
        path: '/rate/about',
        name: 'about',
        component: () => import('../views/rate/inRate/about.vue'),
        meta: {
          title: '关于'
        }
      },
      {
        path: '/rate/rateList',
        name: 'rateList',
        component: () => import('../views/rate/inRate/rateList.vue'),
        meta: {
          title: '评分列表'
        }
      },
      {
        path: '/rate/rateDetail',
        name: 'rateDetail',
        component: () => import('../views/rate/inRate/rateDetail.vue'),
        meta: {
          title: '评分详情'
        }
      },
      {
        path: '/rate/userInfo',
        name: 'userInfo',
        component: () => import('../views/rate/inRate/userInfo.vue'),
        meta: {
          title: '评委信息'
        }
      }
    ]
  },
  {
    path: '/login',
    name: 'login',
    // component: () => import('../views/user/Login.vue'),
    component: () => import('../views/closed.vue'),
    meta: {
      title: '用户登录'
    }
  },
  {
    path: '/register',
    name: 'register',
    // component: () => import('../views/user/Register.vue'),
    component: () => import('../views/closed.vue'),
    meta: {
      title: '用户注册'
    }
  },
  {
    path: '/info',
    name: 'info',
    // component: () => import('../views/user/Info.vue'),
    component: () => import('../views/closed.vue'),
    meta: {
      title: '用户信息'
    }
  },
  {
    path: '/rateLogin',
    name: 'rateLogin',
    component: () => import('../views/rate/rateLogin.vue'),
    meta: {
      title: '评委登录'
    }
  },
  {
    path: '/rateRegister',
    name: 'rateRegister',
    component: () => import('../views/rate/rateRegister.vue'),
    meta: {
      title: '评委注册'
    }
  },
  {
    path: '/desc',
    name: 'desc',
    component: () => import('../views/desc/desc.vue'),
    meta: {
      title: '赛事说明'
    }
  },
  {
    path: '/inform',
    name: 'inform',
    component: () => import('../views/inform/inform.vue'),
    meta: {
      title: '赛事通知'
    }
  },
  {
    path: '/entry',
    name: 'entry',
    component: () => import('../views/entry/Entry.vue'),
    meta: {
      title: '作品查看'
    }
  },
  {
    path: '/manage',
    name: 'manage',
    component: () => import('../views/manage/Manage.vue'),
    meta: {
      title: '后台管理面板'
    },
    children: [
      {
        path: '/manage/index',
        name: 'manageIndex',
        component: () => import('../views/manage/inManage/index.vue'),
        meta: {
          title: '首页'
        }
      },
      {
        path: '/manage/organization',
        name: 'organization',
        component: () => import('../views/manage/inManage/organization.vue'),
        meta: {
          title: '组织机构'
        }
      },
      {
        path: '/manage/project',
        name: 'project',
        component: () => import('../views/manage/inManage/project.vue'),
        meta: {
          title: '比赛项目'
        }
      },
      {
        path: '/manage/participant',
        name: 'participant',
        component: () => import('../views/manage/inManage/participant.vue'),
        meta: {
          title: '参赛人员'
        }
      },
      {
        path: '/manage/judge',
        name: 'judge',
        component: () => import('../views/manage/inManage/judge.vue'),
        meta: {
          title: '评委管理'
        }
      },
      {
        path: '/manage/entry',
        name: 'manageEntry',
        component: () => import('../views/manage/inManage/entry.vue'),
        meta: {
          title: '参赛作品'
        }
      },
      {
        path: '/manage/record',
        name: 'record',
        component: () => import('../views/manage/inManage/record.vue'),
        meta: {
          title: '评分记录'
        }
      }
    ]
  },
  {
    path: '/manageLogin',
    name: 'manageLogin',
    component: () => import('../views/manage/manageLogin.vue'),
    meta: {
      title: '评委登录'
    }
  },
  
]

const router = new VueRouter({
  routes
})


router.beforeEach((to,from,next)=>{//beforeEach是router的钩子函数，在进入路由前执行
    if(to.meta.title){//判断是否有标题
        document.title = to.meta.title
    }
    next()  //执行进入路由，如果不写就不会进入目标页
})

export default router
