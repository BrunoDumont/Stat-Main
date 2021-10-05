//core
import React from 'react'
import clsx from "clsx";

type ToggleBodyContentType = {
  type: string,
  setType: (elem: string) => void
}

const ToggleBodyContent: React.FC<ToggleBodyContentType> = ({type, setType}) => {
  return (
    <div className="grid grid-cols-2">
      <div className={clsx("text-center cursor-pointer text-xl", type !== "login" && "text-gray-400")}>
        <span onClick={() => setType('login')}>Вход</span>
        <hr className={clsx("border-t-2 mt-2", type === "login" ? "border-gold" : "border-gray" )}/>
      </div>
      <div className={clsx("text-center cursor-pointer text-xl", type !== "signUp" && "text-gray-400")}>
        <span onClick={() => setType('signUp')}>Регистрация</span>
        <hr className={clsx("border-t-2 mt-2", type === "signUp" ? "border-gold" : "border-gray" )}/>
      </div>
    </div>
  )
}

export default ToggleBodyContent