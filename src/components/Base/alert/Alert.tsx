import React from "react";
import {CSSTransition, TransitionGroup} from "react-transition-group";

import {useAppDispatch, useAppSelector} from "@/store/hooks";

import './alert.scss'
import {removeAlert} from "@/store/features/alertSlice";

const Alert: React.FC = () => {

  const alerts = useAppSelector((state) => state.alert.alerts)
  const dispatch = useAppDispatch()

  return <div className="fixed right-0 w-full md:w-80 px-4">
    <TransitionGroup className="todo-list">
      {Object.entries(alerts).map(([key, alert]) => {
        setTimeout(() => {
          dispatch(removeAlert(Number(key)))
        }, 3000)

        let alert_type = ''

        if (alert.type === 'success') {
          alert_type = 'check'
        } else if (alert.type === 'notification') {
          alert_type = 'notifications_active'
        }

        return <CSSTransition
          key={key}
          timeout={500}
          classNames="item"
        >
          <div className="my-2 p-4 bg-white  shadow-lg rounded relative">
            <i
              className="material-icons text-sm text-gray-600 ml-auto absolute top-1 right-1 cursor-pointer"
              onClick={() => dispatch(removeAlert(Number(key)))}
            >close</i>
            <div className="flex content-start">
              <div className="mr-2 rounded-full bg-gold bg-opacity-25 w-8 h-8 text-center align-middle inline-block">
                <i
                  className="material-icons text-2xl text-gold ">
                  {alert_type}
                </i>
              </div>
              <p className="w-52 overflow-hidden inline-block">{alert.message}</p>
            </div>
          </div>
        </CSSTransition>
      })}
    </TransitionGroup>
  </div>
}

export default Alert