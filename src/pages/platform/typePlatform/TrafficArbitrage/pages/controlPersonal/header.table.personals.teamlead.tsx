//core
import React, {useState} from "react";
import clsx from "clsx";
import Popover from "react-popover";

//types
import {
  IControlPerson, user_group, UserGroupType,
} from "@pages/platform/typePlatform/TrafficArbitrage/pages/controlPersonal/СontrolPersonal";

const header_table_personals_teamLead = (updateUser: (user: IControlPerson) => void, user: IUser) => [
  {
    Header: "ID",
    accessor: "id",
    width: 100,
    Cell: ({row}: any) => {
      const expand = row.canExpand ? (
        <span
          className={clsx("material-icons ml-2 transition duration-500 ease-in-out", {'transform rotate-180 ': row.isExpanded})}
          {...row.getToggleRowExpandedProps()}
        >expand_more</span>
      ) : null
      return <div className="flex place-items-center">
        <span className="">{row.values.id}</span>
        {expand}
      </div>
    }
  },
  {
    Header: "Имя пользователя",
    accessor: "username",
  },
  {
    Header: "Группа",
    accessor: "group",
    Cell: ({row}: any) => {
      const group: keyof UserGroupType = row.values.group
      return user_group[group]
    }
  },
  {
    Header: "Статус",
    accessor: "status",
    width: 150,
    Cell: ({row}: any) => {
      return typeof row.values.status !== "undefined"
        ? (
          <span
            className="p-1 text-sm my-auto rounded"
            style={{
              background: row.values.status ? "#F7FAED" : '#FFF2F7',
              color: row.values.status ? '#8BA63A' : '#CC5C81'
            }}
          >
                        {(row.values.status ? "Активный" : "Не активный")}
                    </span>
        )
        : null
    }
  },
  {
    Header: "Оффер",
    accessor: "offer",
    Cell: ({row}: any) => {
      const [showPopover, setShowPopover] = useState(false)
      const offers = row.original.offerByUser
        ? row.original.offerByUser.map((el: IOfferByUser) => el.offer)
        : []
      if (offers.length === 1) return offers[0].name
      if (offers.length > 1) return <Popover
        className="z-20"
        body={<div className=" rounded p-4 bg-black bg-opacity-75 text-white z-20">
          {offers.map((offer: IOffer, index: number) => <p key={index}>{index + 1}. {offer.name}</p>)}
        </div>}
        isOpen={showPopover}>
                <span
                  className="underline"
                  onMouseEnter={() => setShowPopover(true)}
                  onMouseLeave={() => setShowPopover(false)}
                >
                    {offers[0].name}
                </span>
      </Popover>
      return '-'
    }
  },
  {
    Header: "Редактировать",
    accessor: "edit",
    width: 200,
    Cell: ({row}: any) => {
      if (!user || !row.values) return null
      return <div
        className={clsx("flex cursor-pointer", {'cursor-not-allowed': (user.id !== row.values.id && row.values.group !== 'CLIENT_TRAFFIC_MANAGER')})}
        onClick={() => {
          if (user.id === row.values.id || row.values.group === 'CLIENT_TRAFFIC_MANAGER'){
            updateUser(row.original)
          }
        }}
      >
        <span className="material-icons mr-2 my-auto">edit</span>
        <span className="my-auto truncate">Редактировать</span>
      </div>
    }
  },
]

export default header_table_personals_teamLead