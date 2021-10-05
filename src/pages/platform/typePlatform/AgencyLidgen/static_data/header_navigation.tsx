//core
import React, {lazy, Suspense} from "react";

//pages
const ControlPersonal = lazy(() => import('../pages/controlPersonal/СontrolPersonal'));
import GlobalLoader from "@components/Loaders/GlobaLoader";

const header_navigation = (pathToPlatform: string, activePage: string, user: IUser) => {
  return [
    {
      path: pathToPlatform + '/',
      name: 'Дэшборд',
      active: activePage === undefined,
      icon: 'dashboard',
      has_user_access: ['CLIENT', 'CLIENT_ADMIN', 'CLIENT_PROJECT_MANAGER',
        'CLIENT_TRAFFIC_MANAGER', 'CLIENT_MANAGER', 'CLIENT_CLIENT', 'CLIENT_CONTRACTOR'].includes(user.group),
      component: <div>Dashboard</div>
    },
    {
      path: pathToPlatform + '/leads',
      name: 'Лиды',
      active: activePage === 'leads',
      icon: 'assignment_ind',
      has_user_access: ['CLIENT', 'CLIENT_ADMIN', 'CLIENT_PROJECT_MANAGER',
        'CLIENT_TRAFFIC_MANAGER', 'CLIENT_MANAGER', 'CLIENT_CLIENT', 'CLIENT_CONTRACTOR'].includes(user.group),
      component: <div>Leads</div>
    },
    {
      name: 'Аналитика',
      icon: 'leaderboard',
      has_user_access: ['CLIENT', 'CLIENT_ADMIN', 'CLIENT_PROJECT_MANAGER',
        'CLIENT_TRAFFIC_MANAGER', 'CLIENT_MANAGER', 'CLIENT_CLIENT', 'CLIENT_CONTRACTOR'].includes(user.group),
      child: [
        {
          path: pathToPlatform + '/statistic',
          name: 'Статистика',
          active: activePage === 'statistic',
          has_user_access: ['CLIENT', 'CLIENT_ADMIN', 'CLIENT_PROJECT_MANAGER',
            'CLIENT_TRAFFIC_MANAGER', 'CLIENT_MANAGER', 'CLIENT_CONTRACTOR'].includes(user.group),
          component: <div>statistic</div>
        },
        {
          path: pathToPlatform + '/statistic_date',
          name: 'По датам',
          active: activePage === 'statistic_date',
          has_user_access: ['CLIENT', 'CLIENT_ADMIN', 'CLIENT_PROJECT_MANAGER',
            'CLIENT_TRAFFIC_MANAGER', 'CLIENT_MANAGER', 'CLIENT_CONTRACTOR'].includes(user.group),
          component: <div>statistic_date</div>
        },
        {
          path: pathToPlatform + '/statistic_offer',
          name: 'По офферам',
          active: activePage === 'statistic_offer',
          has_user_access: ['CLIENT', 'CLIENT_ADMIN', 'CLIENT_PROJECT_MANAGER',
            'CLIENT_TRAFFIC_MANAGER', 'CLIENT_MANAGER', 'CLIENT_CONTRACTOR'].includes(user.group),
          component: <div>statistic_offer</div>
        },
        {
          path: pathToPlatform + '/statistic_deposit',
          name: 'По депозитам',
          active: activePage === 'statistic_deposit',
          has_user_access: ['CLIENT', 'CLIENT_ADMIN', 'CLIENT_PROJECT_MANAGER',
            'CLIENT_MANAGER'].includes(user.group),
          component: <div>statistic_deposit</div>
        },
        {
          path: pathToPlatform + '/statistic_status',
          name: 'По осн. статусам',
          active: activePage === 'statistic_status',
          has_user_access: ['CLIENT', 'CLIENT_ADMIN', 'CLIENT_PROJECT_MANAGER',
            'CLIENT_TRAFFIC_MANAGER', 'CLIENT_MANAGER', 'CLIENT_CLIENT'].includes(user.group),
          component: <div>statistic_status</div>
        },
        {
          path: pathToPlatform + '/statistic_extra_status',
          name: 'По доп. статусам',
          active: activePage === 'statistic_extra_status',
          has_user_access: ['CLIENT', 'CLIENT_ADMIN', 'CLIENT_PROJECT_MANAGER',
            'CLIENT_TRAFFIC_MANAGER', 'CLIENT_MANAGER', 'CLIENT_CLIENT', 'CLIENT_CONTRACTOR'].includes(user.group),
          component: <div>statistic_extra_status</div>
        },
      ]
    },
    {
      path: pathToPlatform + '/integration',
      name: 'Интеграция',
      active: activePage === 'integration',
      icon: 'extension',
      has_user_access: ['CLIENT', 'CLIENT_ADMIN', 'CLIENT_PROJECT_MANAGER',
        'CLIENT_TRAFFIC_MANAGER', 'CLIENT_CLIENT', 'CLIENT_CONTRACTOR'].includes(user.group),
      component: <div>integration</div>
    },
    {
      name: 'Сотрудники',
      icon: 'people',
      has_user_access: ['CLIENT', 'CLIENT_ADMIN', 'CLIENT_PROJECT_MANAGER'].includes(user.group),
      child: [
        {
          path: pathToPlatform + '/controlPersonal',
          name: 'Управление сотрудниками',
          active: activePage === 'controlPersonal',
          has_user_access: ['CLIENT', 'CLIENT_ADMIN', 'CLIENT_PROJECT_MANAGER'].includes(user.group),
          component:  <Suspense fallback={GlobalLoader}><ControlPersonal/></Suspense>
        },
        {
          path: pathToPlatform + '/controlContractor',
          name: 'Управление подрядчиками',
          active: activePage === 'controlContractor',
          has_user_access: ['CLIENT', 'CLIENT_ADMIN', 'CLIENT_PROJECT_MANAGER'].includes(user.group),
          component: <div>controlContractor</div>
        },
        {
          path: pathToPlatform + '/efficiencyPersonal',
          name: 'Эффективность сотрудников',
          active: activePage === 'efficiencyPersonal',
          has_user_access: ['CLIENT', 'CLIENT_ADMIN', 'CLIENT_PROJECT_MANAGER'].includes(user.group),
          component: <div>efficiencyPersonal</div>
        },
        {
          path: pathToPlatform + '/efficiencyContractor',
          name: 'Эффективность подрядчиков',
          active: activePage === 'efficiencyContractor',
          has_user_access: ['CLIENT', 'CLIENT_ADMIN', 'CLIENT_PROJECT_MANAGER'].includes(user.group),
          component: <div>efficiencyContractor</div>
        }
      ]
    },
    {
      path: pathToPlatform + '/offers',
      name: 'Офферы',
      active: activePage === 'offers',
      icon: 'work',
      has_user_access: ['CLIENT', 'CLIENT_ADMIN', 'CLIENT_PROJECT_MANAGER',
        'CLIENT_TRAFFIC_MANAGER', 'CLIENT_MANAGER', 'CLIENT_CONTRACTOR'].includes(user.group),
      component: <div>offers</div>
    },
    {
      name: 'Клиенты',
      icon: 'supervisor_account',
      has_user_access: ['CLIENT', 'CLIENT_ADMIN', 'CLIENT_PROJECT_MANAGER', 'CLIENT_MANAGER'].includes(user.group),
      child: [
        {
          path: pathToPlatform + '/controlClients',
          name: 'Управление клиентами',
          active: activePage === 'controlClients',
          has_user_access: ['CLIENT', 'CLIENT_ADMIN', 'CLIENT_PROJECT_MANAGER', 'CLIENT_MANAGER'].includes(user.group),
          component: <div>controlClients</div>
        },
        {
          path: pathToPlatform + '/notificationClients',
          name: 'Уведомления клиентов',
          active: activePage === 'notificationClients',
          has_user_access: ['CLIENT', 'CLIENT_ADMIN', 'CLIENT_PROJECT_MANAGER', 'CLIENT_MANAGER'].includes(user.group),
          component: <div>notificationClients</div>
        },
      ]
    },
    {
      name: 'Инструменты',
      icon: 'build',
      has_user_access: ['CLIENT', 'CLIENT_ADMIN', 'CLIENT_PROJECT_MANAGER',
        'CLIENT_TRAFFIC_MANAGER', 'CLIENT_CONTRACTOR'].includes(user.group),
      child: [
        {
          path: pathToPlatform + '/landings',
          name: 'Лэндинги',
          active: activePage === 'landings',
          has_user_access: ['CLIENT', 'CLIENT_ADMIN', 'CLIENT_PROJECT_MANAGER',
            'CLIENT_TRAFFIC_MANAGER', 'CLIENT_CONTRACTOR'].includes(user.group),
          component: <div>landings</div>
        },
        {
          path: pathToPlatform + '/flows',
          name: 'Потоки',
          active: activePage === 'flows',
          has_user_access: ['CLIENT', 'CLIENT_ADMIN', 'CLIENT_PROJECT_MANAGER',
            'CLIENT_TRAFFIC_MANAGER', 'CLIENT_CONTRACTOR'].includes(user.group),
          component: <div>flows</div>
        },
      ]
    },
    {
      name: 'Бухгалтерия',
      icon: 'account_balance_wallet',
      has_user_access: ['CLIENT', 'CLIENT_ADMIN', 'CLIENT_MANAGER', 'CLIENT_CLIENT'].includes(user.group),
      child: [
        {
          path: pathToPlatform + '/scores',
          name: 'Счета',
          active: activePage === 'scores',
          has_user_access: ['CLIENT', 'CLIENT_ADMIN', 'CLIENT_MANAGER', 'CLIENT_CLIENT'].includes(user.group),
          component: <div>scores</div>
        },
        {
          path: pathToPlatform + '/finances',
          name: 'Финансы',
          active: activePage === 'finances',
          has_user_access: ['CLIENT', 'CLIENT_ADMIN', 'CLIENT_MANAGER'].includes(user.group),
          component: <div>finances</div>
        },
        {
          path: pathToPlatform + '/revise',
          name: 'Сверка',
          active: activePage === 'revise',
          has_user_access: ['CLIENT', 'CLIENT_ADMIN', 'CLIENT_MANAGER'].includes(user.group),
          component: <div>revise</div>
        },
        {
          path: pathToPlatform + '/revise_acts',
          name: 'Акты сверки',
          active: activePage === 'revise_acts',
          has_user_access: ['CLIENT', 'CLIENT_ADMIN', 'CLIENT_MANAGER', 'CLIENT_CLIENT'].includes(user.group),
          component: <div>revise_acts</div>
        },
        {
          path: pathToPlatform + '/working_acts',
          name: 'Акты вып. работ',
          active: activePage === 'working_acts',
          has_user_access: ['CLIENT', 'CLIENT_ADMIN', 'CLIENT_MANAGER', 'CLIENT_CLIENT'].includes(user.group),
          component: <div>working_acts</div>
        },
      ]
    },
    {
      path: pathToPlatform + '/scores',
      name: 'Счета',
      active: activePage === 'scores',
      icon: 'account_balance_wallet',
      has_user_access: ['CLIENT_PROJECT_MANAGER'].includes(user.group),
      component: <div>scores</div>
    },
    {
      path: pathToPlatform + '/payments',
      name: 'Выплаты',
      active: activePage === 'payments',
      icon: 'account_balance_wallet',
      has_user_access: ['CLIENT_CONTRACTOR'].includes(user.group),
      component: <div>payments</div>
    },
    {
      path: pathToPlatform + '/profiles',
      name: 'Профили юр. лиц',
      active: activePage === 'profiles',
      icon: 'work',
      has_user_access: ['CLIENT', 'CLIENT_ADMIN'].includes(user.group),
      component: <div>profiles</div>
    },
  ]
}

export default header_navigation