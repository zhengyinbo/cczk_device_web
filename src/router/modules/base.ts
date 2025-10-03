import { DashboardIcon } from 'tdesign-icons-vue';
import Layout from '@/layouts/index.vue';

export default [
  // {
  //   path: '/dashboard',
  //   component: Layout,
  //   redirect: '/dashboard/base',
  //   name: 'dashboard',
  //   meta: {
  //     title: '仪表盘',
  //     icon: DashboardIcon,
  //   },
  //   children: [
  //     {
  //       path: 'base',
  //       name: 'DashboardBase',
  //       component: () => import('@/pages/dashboard/base/index.vue'),
  //       meta: { title: '概览仪表盘'},
  //     },
  //     {
  //       path: 'detail',
  //       name: 'DashboardDetail',
  //       component: () => import('@/pages/dashboard/detail/index.vue'),
  //       meta: { title: '统计报表' },
  //     },
  //   ],
  // },
  {
    path: '/user1',
    component: Layout,
    redirect: '/user1/index',
    name: 'user',
    meta: {
      title: '用户管理',
      icon: 'user-1',
      single: true
    },
    children: [
      {
        path: 'index',
        name: 'User',
        component: () => import('@/pages/user1/user.vue'),
        meta: { title: '用户管理'},
      },
    ],
  },
  // {
  //   path: '/order',
  //   component: Layout,
  //   redirect: '/order/index',
  //   name: 'order',
  //   meta: {
  //     title: '订单管理',
  //     icon: 'widget',
  //     single: true
  //   },
  //   children: [
  //     {
  //       path: 'index',
  //       name: 'Order',
  //       component: () => import('@/pages/order/order.vue'),
  //       meta: { title: '订单管理'},
  //     }
  //   ],
  // },
  {
    path: '/deviceCate',
    component: Layout,
    redirect: '/deviceCate/index',
    name: 'deviceCate',
    meta: {
      title: '机器类型管理',
      icon: 'view-module',
      single: true
    },
    children: [
      {
        path: 'index',
        name: 'DeviceCate',
        component: () => import('@/pages/device/cate.vue'),
        meta: { title: '机器类型管理'},
      },
    ],
  },
  {
    path: '/device',
    component: Layout,
    redirect: '/device/index',
    name: 'device',
    meta: {
      title: '机器管理',
      icon: 'widget',
      single: true
    },
    children: [
      {
        path: 'index',
        name: 'Device',
        component: () => import('@/pages/device/device.vue'),
        meta: { title: '机器管理' },
      },
    ],
  },

];
