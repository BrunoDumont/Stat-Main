//core
import React, {lazy, Suspense} from "react";
import GlobalLoader from "@components/Loaders/GlobaLoader";

//pages

const Leads = lazy(() => import('../pages/leads/Leads'));
const ControlPersonal = lazy(() => import('../pages/controlPersonal/СontrolPersonal'));
const Integrations = lazy(() => import('../pages/integrations/Integrations'));
const Offers = lazy(() => import('../pages/offers/Offers'));
const Landings = lazy(() => import('../pages/tools/landings/Landings'));
const Prelandings = lazy(() => import('../pages/tools/prelandings/Prelandings'));
const Flows = lazy(() => import('../pages/tools/flows/Flows'));

const header_navigation = (pathToPlatform: string, activePage: string, user: IUser) => {
  return [
    {
      path: pathToPlatform + '/',
      name: 'Дэшборд',
      active: activePage === undefined,
      icon: 'dashboard',
      has_user_access: ['CLIENT', 'CLIENT_ADMIN', 'CLIENT_TEAM_LEAD', 'CLIENT_TRAFFIC_MANAGER'].includes(user.group),
      component: <div>Dashboard</div>
    },
    {
      path: pathToPlatform + '/leads',
      name: 'Лиды',
      active: activePage === 'leads',
      icon: 'assignment_ind',
      has_user_access: ['CLIENT', 'CLIENT_ADMIN', 'CLIENT_TEAM_LEAD', 'CLIENT_TRAFFIC_MANAGER'].includes(user.group),
      component:  <Suspense fallback={GlobalLoader}><Leads user={user}/></Suspense>
    },
    {
      name: 'Аналитика',
      icon: 'leaderboard',
      has_user_access: ['CLIENT', 'CLIENT_ADMIN', 'CLIENT_TEAM_LEAD', 'CLIENT_TRAFFIC_MANAGER'].includes(user.group),
      child: [
        {
          path: pathToPlatform + '/statistic',
          name: 'Статистика',
          active: activePage === 'statistic',
          has_user_access: ['CLIENT', 'CLIENT_ADMIN', 'CLIENT_TEAM_LEAD', 'CLIENT_TRAFFIC_MANAGER'].includes(user.group),
          component: <div>statistic</div>
        },
        {
          path: pathToPlatform + '/statistic_date',
          name: 'По датам',
          active: activePage === 'statistic_date',
          has_user_access: ['CLIENT', 'CLIENT_ADMIN', 'CLIENT_TEAM_LEAD', 'CLIENT_TRAFFIC_MANAGER'].includes(user.group),
          component: <div>statistic_date</div>
        },
        {
          path: pathToPlatform + '/statistic_offer',
          name: 'По офферам',
          active: activePage === 'statistic_offer',
          has_user_access: ['CLIENT', 'CLIENT_ADMIN', 'CLIENT_TEAM_LEAD', 'CLIENT_TRAFFIC_MANAGER'].includes(user.group),
          component: <div>statistic_offer</div>
        },
        {
          path: pathToPlatform + '/statistic_ab',
          name: 'По A/B',
          active: activePage === 'statistic_ab',
          has_user_access: ['CLIENT', 'CLIENT_ADMIN', 'CLIENT_TEAM_LEAD', 'CLIENT_TRAFFIC_MANAGER'].includes(user.group),
          component: <div>statistic_ab</div>
        },
        {
          path: pathToPlatform + '/statistic_status',
          name: 'По статусам',
          active: activePage === 'statistic_status',
          has_user_access: ['CLIENT', 'CLIENT_ADMIN', 'CLIENT_TEAM_LEAD', 'CLIENT_TRAFFIC_MANAGER'].includes(user.group),
          component: <div>statistic_status</div>
        }
      ]
    },
    {
      path: pathToPlatform + '/integration',
      name: 'Интеграция',
      active: activePage === 'integration',
      icon: 'extension',
      has_user_access: ['CLIENT', 'CLIENT_ADMIN', 'CLIENT_TEAM_LEAD', 'CLIENT_TRAFFIC_MANAGER'].includes(user.group),
      component: <Suspense fallback={GlobalLoader}><Integrations/></Suspense>
    },
    {
      name: 'Сотрудники',
      icon: 'people',
      has_user_access: ['CLIENT', 'CLIENT_ADMIN', 'CLIENT_TEAM_LEAD'].includes(user.group),
      child: [
        {
          path: pathToPlatform + '/controlPersonal',
          name: 'Управление сотрудниками',
          active: activePage === 'controlPersonal',
          has_user_access: ['CLIENT', 'CLIENT_ADMIN', 'CLIENT_TEAM_LEAD'].includes(user.group),
          component: <Suspense fallback={GlobalLoader}><ControlPersonal user={user}/></Suspense>
        },
        {
          path: pathToPlatform + '/efficiencyPersonal',
          name: 'Эффективность сотрудников',
          active: activePage === 'efficiencyPersonal',
          has_user_access: ['CLIENT', 'CLIENT_ADMIN', 'CLIENT_TEAM_LEAD'].includes(user.group),
          component: <Suspense fallback={GlobalLoader}><div>efficiencyPersonal</div></Suspense>
        }
      ]
    },
    {
      path: pathToPlatform + '/offers',
      name: 'Офферы',
      active: activePage === 'offers',
      icon: 'work',
      has_user_access: ['CLIENT', 'CLIENT_ADMIN', 'CLIENT_TEAM_LEAD', 'CLIENT_TRAFFIC_MANAGER'].includes(user.group),
      component: <Suspense fallback={GlobalLoader}><Offers user={user}/></Suspense>
    },
    {
      name: 'Инструменты',
      icon: 'build',
      has_user_access: ['CLIENT', 'CLIENT_ADMIN', 'CLIENT_TEAM_LEAD', 'CLIENT_TRAFFIC_MANAGER'].includes(user.group),
      child: [
        {
          path: pathToPlatform + '/landings',
          name: 'Лендинги',
          active: activePage === 'landings',
          has_user_access: ['CLIENT', 'CLIENT_ADMIN', 'CLIENT_TEAM_LEAD', 'CLIENT_TRAFFIC_MANAGER'].includes(user.group),
          component: <Suspense fallback={GlobalLoader}><Landings/></Suspense>
        },
        {
          path: pathToPlatform + '/prelandings',
          name: 'Прелендинги',
          active: activePage === 'prelandings',
          has_user_access: ['CLIENT', 'CLIENT_ADMIN', 'CLIENT_TEAM_LEAD', 'CLIENT_TRAFFIC_MANAGER'].includes(user.group),
          component: <Suspense fallback={GlobalLoader}><Prelandings/></Suspense>
        },
        {
          path: pathToPlatform + '/flows',
          name: 'Потоки',
          active: activePage === 'flows',
          has_user_access: ['CLIENT', 'CLIENT_ADMIN', 'CLIENT_TEAM_LEAD', 'CLIENT_TRAFFIC_MANAGER'].includes(user.group),
          component: <Suspense fallback={GlobalLoader}><Flows/></Suspense>
        },
      ]
    },
    {
      path: pathToPlatform + '/finances',
      name: 'Финансы',
      active: activePage === 'finances',
      icon: 'work',
      has_user_access: ['CLIENT', 'CLIENT_ADMIN'].includes(user.group),
      component: <div>finances</div>
    }
  ]
}

export default header_navigation