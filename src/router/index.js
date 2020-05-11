import Vue from 'vue'
import VueRouter from 'vue-router'
import login from '../components/login'
import home from '../components/home'
import welcome from '../components/welcome'
import users from '../components/user/users'
import worker from '../components/worker/worker'
import car from '../components/car/car'
import stock from '../components/stock/stock'
import authority from '../components/authority/authority'
import project from '../components/project/project'
import order from '../components/order/order'
import carManage from '../components/carManage/carManage'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: login
  },
  {
    path: '/home',
    component: home,
    redirect:'/welcome',
    children:[
      {path:'/welcome',component:welcome},
      {path:'/user',component: users},
      {path:'/worker',component: worker},
      {path:'/car',component: car},
      {path:'/stock',component: stock},
      {path:'/stock',component: stock},
      {path:'/authority',component: authority},
      {path:'/project',component: project},
      {path:'/order',component: order},
      {path:'/carManage',component: carManage},
    ]
  }

]

const router = new VueRouter({
  routes
})




//路由守卫
router.beforeEach(
    (to, from, next) => {
      if(to.path=='/login') return next()
      var token  = window.sessionStorage.getItem('token')
      if(token!=null) {
        next()
      }else {
        next('/login')
      }
    }
)

export default router
