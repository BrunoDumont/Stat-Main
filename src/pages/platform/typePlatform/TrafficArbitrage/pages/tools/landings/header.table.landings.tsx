//core
import React from "react";
import clsx from "clsx";
import {AlertManager} from "react-alert";
import TableCell from "@pages/platform/components/table.cell/TableCell";

const header_table_landing = (updateLanding: (landing: ILanding) => void, alert: AlertManager) => [
  {
    Header: "ID",
    accessor: "id",
    width: 100,
    Cell: ({row}: any) => {
      const expand = row.canExpand ? (
        <span
          className={clsx("material-icons ml-2 transition duration-500 ease-in-out", {'transform rotate-180 ': row.isExpanded})}
          {...row.getToggleRowExpandedProps()}
        >
                    expand_more
                </span>
      ) : null
      return <div className="flex place-items-center">
        <span className="">{row.values.id}</span>
        {expand}
      </div>
    }
  },
  {
    Header: "Название",
    accessor: "name",
    Cell: ({row}: any) => {
      if (row.original.name) {
        return <TableCell>{row.original.name}</TableCell>
      }
      return ''
    }
  },
  {
    Header: "Владелец",
    accessor: "account",
    Cell: ({row}: any) => {
      if (row.original.account) {
        return <TableCell>{row.original.account.username}</TableCell>
      }
      return ''
    }
  },
  {
    Header: "Оффер",
    accessor: "offer",
    Cell: ({row}: any) => {
      if (row.original.offer) {
        return <TableCell>{row.original.offer.name}</TableCell>
      }
      return ''
    }
  },
  {
    Header: "Ссылка",
    accessor: "url",
    Cell: ({row}: any) => {
      const url = row.original.url

      return <TableCell>
        <span
          className="underline cursor-pointer"
          title="Скопировать"
          onClick={() => {
            navigator.clipboard.writeText(url).then(() => alert.success('Ссылка скопирована'))
          }}
        >
          {url}
        </span>
      </TableCell>
    }
  },
  {
    Header: "Редактировать",
    accessor: "edit",
    Cell: ({row}: any) => {
      const canEdit = !row.original.landingsByFlow.find((el: any) => el.useInFlow)
      if (row.original.id) return <div
        className={clsx("flex ", canEdit ? 'cursor-pointer' : 'cursor-not-allowed text-gray-400')}
        onClick={() => {
          if (canEdit) {
            updateLanding(row.original)
          }
        }}
      >
        <span className="material-icons mr-2 my-auto">edit</span>
        <span className="my-auto truncate">Редактировать</span>
      </div>
      return null
    }
  },
]

export default header_table_landing