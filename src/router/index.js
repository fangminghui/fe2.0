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
const Monitor = () => import('../pages/Monitor')
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
      path: '/Monitor',
      name: 'Monitor',
      component: Monitor,
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