import { createRouter, createWebHistory } from 'vue-router'
const WarningMessage = () => import('../pages/WarningMessage')
const UserManagement = () => import('../pages/UserManagement')
const WarningManagement = () => import('../pages/WarningManagement')
const EquipmentManagement = () => import('../pages/EquipmentManagement')
const EquipmentType = () => import('../pages/EquipmentType')
const DataCompare = () => import('../pages/DataCompare')
const DataPredict = () => import('../pages/DataPredict')
const DataReview = () => import('../pages/DataReview')
const Videos = () => import('../pages/Videos')
const Monitor1 = () => import('../pages/monitor/Monitor1')
const Monitor2 = () => import('../pages/monitor/Monitor2')
const Monitor3 = () => import('../pages/monitor/Monitor3')
const Monitor4 = () => import('../pages/monitor/Monitor4')
const Monitor5 = () => import('../pages/monitor/Monitor5')
const Monitor6 = () => import('../pages/monitor/Monitor6')
const Monitor7 = () => import('../pages/monitor/Monitor7')
const SQL = () => import('../pages/SQL')

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/WarningMessage',
      name: 'WarningMessage',
      component: WarningMessage,
    },
    {
      path: '/UserManagement',
      name: 'UserManagement',
      component: UserManagement,
    },
    {
      path: '/WarningManagement',
      name: 'WarningManagement',
      component: WarningManagement,
    },
    {
      path: '/EquipmentManagement',
      name: 'EquipmentManagement',
      component: EquipmentManagement,
    },
    {
      path: '/DataCompare',
      name: 'DataCompare',
      component: DataCompare,
    },
    {
      path: '/DataPredict',
      name: 'DataPredict',
      component: DataPredict,
    },
    {
      path: '/DataReview',
      name: 'DataReview',
      component: DataReview,
    },
    {
      path: '/Videos',
      name: 'Videos',
      component: Videos,
    },
    {
      path: '/Monitor1',
      name: 'Monitor1',
      component: Monitor1,
    },
    {
      path: '/Monitor2',
      name: 'Monitor2',
      component: Monitor2,
    },
    {
      path: '/Monitor3',
      name: 'Monitor3',
      component: Monitor3,
    },
    {
      path: '/Monitor4',
      name: 'Monitor4',
      component: Monitor4,
    },
    {
      path: '/Monitor5',
      name: 'Monitor5',
      component: Monitor5,
    },
    {
      path: '/Monitor6',
      name: 'Monitor6',
      component: Monitor6,
    },
    {
      path: '/Monitor7',
      name: 'Monitor7',
      component: Monitor7,
    },
    {
      path: '/EquipmentType',
      name: 'EquipmentType',
      component: EquipmentType,
    },
    {
      path: '/SQL',
      name: 'SQL',
      component: SQL,
    },
  ]
})

export default router