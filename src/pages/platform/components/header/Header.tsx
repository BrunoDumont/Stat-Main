//core
import React, {Suspense, useMemo, useState} from 'react'
import clsx from "clsx";

//components
import {ElementNavbar, ListElement} from "@pages/platform/components/header/ElementNavbar";
import GlobalLoader from "@components/Loaders/GlobaLoader";
import PageNotFound from "@pages/common/ErrorPages/PageNotFound404";
import header_navigation from "@pages/platform/typePlatform/AgencyLidgen/static_data/header_navigation";

export interface NavList {
  path?: string,
  name: string,
  active?: boolean,
  icon?: string,
  child?: Array<NavList>
}

const Header: React.FC = () => {
  const [openNav, setOpenNav] = useState(false)

    const navList = [
    {
      path: '/',
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
  return (
    <>
      <div className="fixed left-0 top-0 w-full p-3 h-12 border-b z-10 align-middle bg-white">
        <div className="flex">
          <span className="material-icons md:hidden mx-2" onClick={() => setOpenNav(prev => !prev)}>
            {openNav ? "close" : "menu" }
          </span>
          <span>{platformName}</span>
        </div>

      </div>
      <div
        className={clsx("mt-12 fixed left-0 top-0 h-full z-10 w-0 bg-white overflow-x-auto transition-all duration-700",
          openNav ? 'w-64' : 'md:w-12')}
        onMouseEnter={() => setOpenNav(true)}
        onMouseLeave={() => setOpenNav(false)}
      >
        {navList.map(el => {
          if (el.child) {
            return <ListElement elem={el} key={el.name} openNav={openNav}/>
          }
          return <ElementNavbar elem={el} key={el.name}/>
        })}
      </div>
    </>

  )
}

export default Header