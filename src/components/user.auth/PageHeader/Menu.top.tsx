//core
import React from "react";

import UserAvatar from "@components/user.auth/PageHeader/User.avatar";
import {useAppDispatch, useAppSelector} from "@/store/hooks";
import {setCurrentUser} from "@/store/features/userSlice";


const MenuTop: React.FC = () => {
  const user = useAppSelector(state => state.user.currentUser)
  const dispatch = useAppDispatch()
  const cancelConfirmEmail = () => {
    dispatch(setCurrentUser({...user, isConfirmEmail: true}))
  }
  const email_confirm_jsx = !user.isConfirmEmail &&
      <div className=" w-full z-20 text-center text-white bg-blue-500 px-1">
          Подтвердите ваш адрес электронной почты.
          <u className="cursor-pointer">Отправить письмо с подтверждением повторно</u>
          <span className="material-icons float-right cursor-pointer" onClick={cancelConfirmEmail}>close</span>
      </div>

  const date_tariff_end = user.date_tariff_end ? new Date(user.date_tariff_end) : null
  const delta = date_tariff_end ? date_tariff_end.getDate() - (new Date()).getDate() : 0
  const day = delta === 1 ? 'день' : delta < 4 ? 'дня' : 'дней'
  return (
    <>
      <div className="fixed left-0 top-0 w-full p-2 h-12 border-b z-10 align-middle bg-white flex divide-x">
        <div className="ml-auto flex">
          <i className="material-icons text-myGray my-auto mr-4">account_balance_wallet</i>
          {
            user.tariff === 'PAID' && user.date_tariff_end
              ? <p className="cursor-pointer font-bold my-auto mr-2 px-4 rounded" style={{
                background: delta > 3 ? '#F7FAED' : '#FFF2F6',
                color: delta > 3 ? '#8BA63A' : '#CC5C81',
              }}
              >{delta} {day}</p>
              : <i className="cursor-pointer material-icons my-auto mr-2 px-4 rounded" style={{
                background: '#F7FAED',
                color: 'green',
              }}
              >all_inclusive</i>
          }
        </div>
        <UserAvatar/>
      </div>
      {email_confirm_jsx}
    </>
  )
}

export default MenuTop