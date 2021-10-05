//core
import React, {ForwardedRef} from "react";
import clsx from "clsx";
import {Link} from "react-router-dom";
import CSSTransition from "react-transition-group/CSSTransition";

//components
import {Button} from "@components/Base/Button";

//styles
import './utils.css'


export const NavDocumentation: React.FC = () => {
    return (
        <Link to="/documentation/">
          <span className="hidden  md:inline-block text-gray-500 px-4">
            <i className="material-icons align-middle px-2">live_help</i>
            <span>Документация</span>
          </span>
        </Link>
    )
}

export const NavBalance: React.FC = ({openNav, setOpenNav, initStateForNav, balance}) => {
    return (
        <>
     <span className="hidden md:inline-block text-gray-500 px-4 cursor-pointer" onClick={() => {
         setOpenNav({...initStateForNav, balance: !openNav.balance})
     }}>
            <i className="material-icons align-middle px-2">account_balance_wallet</i>
            <span>{balance} ₽</span>
            <span className="align-top text-xs bg-green-200 text-green-800 rounded m-1 p-1 bg-opacity-50">14 дн.</span>
          </span>
            <BodyForOpenNavNotification toggle={openNav.balance}>
                <div className="divide-y divide-gray-400 divide-opacity-50">
                    <p className="mb-3">
                        Баланса хватит на <br/>
                        <b>14 дней</b>
                    </p>
                    <div className="pt-1">
                        {/*<Input className="mx-0" type="number" placeholder="Введите сумму"/>*/}
                        <Button className="w-full mx-0" type="primary" text="пополнить"/>
                    </div>
                </div>
            </BodyForOpenNavNotification>
        </>
    )
}

export const NavNotification: React.FC = ({openNav, setOpenNav, initStateForNav}) => {
    const notification = [{text: ''}]
    return (
        <span className="px-2">
      <i className="material-icons align-middle cursor-pointer" onClick={() => {
          setOpenNav({...initStateForNav, notifications: !openNav.notifications})
      }}>notifications
      </i>
            {notification.length > 0 && (
                <span className="w-4 h-4 bg-white absolute rounded-full" style={{marginTop: 6, marginLeft: -10}}>
          <span className="absolute animate-ping h-2 w-2 rounded-full bg-pink-400 opacity-75 m-1"/>
          <span className="absolute rounded-full h-2 w-2 bg-pink-500 m-1"/>
        </span>
            )}

            <BodyForOpenNavNotification toggle={openNav.notifications}>
        <p>
          Уведомления <br/>
          <b>14 дней</b>
        </p>
      </BodyForOpenNavNotification>
    </span>
    )
}


export const NavUser = ({user, openNav, setOpenNav, initStateForNav}) => {
    return (
        <>
            <span className="pl-2 font-semibold text-black">{user.name}</span>
            <div className="cursor-pointer inline-block " onClick={() => {
                setOpenNav({...initStateForNav, user: !openNav.user})
            }}>
                <i className="material-icons align-middle px-1 ">keyboard_arrow_down</i>
                <span
                    className="rounded-full bg-gray-400 text-gray-700 p-2 text-center h-10 w-10 inline-block font-semibold">
            {user.name[0]}
        </span>
            </div>
            <BodyForOpenNavNotification toggle={openNav.user}>
                <div className="text-left text-black cursor-pointer">
                    <Link to="/settings/">
                        <p className="hover:bg-gray-200 p-1">
                            Настройка аккаунт
                        </p>
                    </Link>
                    <p className="hover:bg-gray-200 p-1">
                        История оплат
                    </p>
                    <p className="hover:bg-gray-200 p-1">
                        Поддержка
                    </p>
                    <p className="hover:bg-gray-200 p-1" onClick={() => {
                        // workWithServer.logOut()
                        // initUser({
                        //   email: ''
                        // })
                    }}>
                        Выход
                    </p>
                </div>
            </BodyForOpenNavNotification>
        </>
    )
}

type BodyForOpenNavNotificationType = {
    toggle: boolean
}

export const BodyForOpenNavNotification: React.FC<BodyForOpenNavNotificationType> = ({toggle, children}) => {
    return (
        <CSSTransition in={toggle} timeout={200} unmountOnExit classNames="NavOpenAnimation">
            <div className={clsx("absolute border rounded bg-white p-3 text-center mt-6 right-0 mr-2")}>
                {children}
            </div>
        </CSSTransition>
    )
}

type TLinkForAuthUser = {
    text: string
}

interface RefObject<T> {
    readonly current: T | null;
}

export const LinkForScroll = React.forwardRef(({text}: TLinkForAuthUser, ref:RefObject<HTMLElement>) => {
    return (
        <span
            className="px-4 cursor-pointer"
            onClick={() => ref && ref.current && ref.current.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
            })}>
            {text}
        </span>
    )
})