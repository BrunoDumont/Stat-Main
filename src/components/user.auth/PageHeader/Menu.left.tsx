//core
import React, {useState} from "react";
import { useLocation } from 'react-router-dom';
import clsx from "clsx";

//components
import Logo from "@components/Base/Logo/Logo";
import {ElementNavbar} from "@pages/platform/components/header/ElementNavbar";

//redux
import {useAppDispatch} from "@/store/hooks";
import Cookies from "js-cookie";
import {setCurrentUser} from "@/store/features/userSlice";


const MenuLeft: React.FC = () => {
  const location = useLocation();
  const dispatch = useAppDispatch()
  const [openNav, setOpenNav] = useState(false)


  const active_path = location.pathname === '/'
    ? '/'
    : `/${location.pathname.split('/')[1]}`

  const navList = [
    {
      path: '/',
      name: 'Статистики',
      active: function () {
        return active_path === this.path
      },
      icon: 'dashboard',
    },
    {
      path: '/integrations',
      name: 'Интеграции',
      active: function () {
        return active_path === this.path
      },
      icon: 'extension',
    },
    {
      path: '/tariffs',
      name: 'Тарифы',
      active: function () {
        return active_path === this.path
      },
      icon: 'account_balance_wallet',
    },
    {
      path: '/portfolio',
      name: 'Портфолио',
      active: function () {
        return active_path === this.path
      },
      icon: 'folder_special',
    },
    {
      path: '/documentation',
      name: 'Документация',
      active: function () {
        return active_path === this.path
      },
      icon: 'school',
    },
    {
      path: '/support',
      name: 'Поддержка',
      active: function () {
        return active_path === this.path
      },
      icon: 'live_help',
    },
    {
      path: '/settings',
      name: 'Настройка',
      active: function () {
        return active_path === this.path
      },
      icon: 'settings',
    },
    {
      path: '/payments',
      name: 'История оплат',
      active: function () {
        return active_path === this.path
      },
      icon: 'history',
    },
    {
      path: '/',
      name: 'Выход',
      active: function () {
        return false
      },
      icon: 'logout',
      onClick: () => {
        Cookies.remove('token')
        dispatch(setCurrentUser({email: '', isLoading: false}))
      }
    },

  ]

  return (
    <>
      <div className="fixed left-0 top-0 p-3 h-12 border-b z-10 align-middle bg-white">
        <div className="flex">
          <Logo/>
          <span className="material-icons md:hidden mx-2 cursor-pointer" onClick={() => setOpenNav(prev => !prev)}>
            {openNav ? "close" : "menu"}
          </span>
        </div>
        <div
          className={clsx("mt-12 fixed left-0 top-0 h-full z-10 w-0 bg-white overflow-x-auto transition-all duration-700",
            openNav ? 'w-64' : 'md:w-12')}
          onMouseEnter={() => setOpenNav(true)}
          onMouseLeave={() => setOpenNav(false)}
        >
          {navList.map(el => {
            return <ElementNavbar elem={el} key={el.name}/>
          })}
        </div>
      </div>
    </>
  )
}

export default MenuLeft