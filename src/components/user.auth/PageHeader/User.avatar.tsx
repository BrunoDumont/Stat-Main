//core
import React from "react";

//redux
import {useAppSelector} from "@/store/hooks";
import workWithServer from "@core/workWithServer";


const UserAvatar: React.FC = () => {
  const user = useAppSelector((state) => state.user.currentUser)

  let url = ''
  if (user.avatar) {
    if (typeof user.avatar === 'object') url = URL.createObjectURL(user.avatar)
    else url = workWithServer.getUserAvatar(user.avatar)
  }

  const firstSymbol = user.username[0]
  return (
    <div className="pl-4 hidden md:flex mr-2">
      <p className="my-auto mr-2 font-bold">{user.username}</p>
      {
        url
          ? <img className="w-8 h-8 rounded-full" src={url} alt={`${firstSymbol}`}/>
          : <div className="w-8 h-8 bg-myGray rounded-full flex">
            <p className="m-auto text-gray-500 font-bold text-2xl">{firstSymbol}</p>
          </div>
      }

    </div>
  )
}

export default UserAvatar