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
      if (row.original.landingsByFlow.length > 0) {
        return <TableCell>{row.original.landingsByFlow[0].landing.offer.name}</TableCell>
      }
      return ''
    }
  },
  {
    Header: "Ссылка",
    accessor: "domain",
    Cell: ({row}: any) => {
      let result = ''
      if (row.original.domain) {
        result = row.original.domain.url + '?id=' + row.original.id + '&' + row.original.app.utm_source
      } else {
        const landings = row.original.landingsByFlow
          .filter((el: ILandingsByFlow) => el.useInFlow)
          .sort((a: ILandingsByFlow, b: ILandingsByFlow) => a.landing.isLanding === b.landing.isLanding
            ? 0
            : b.landing.isLanding
              ? -1
              : 1
          )
        if (landings.length > 0) {
          result = landings[0].landing.url + '?id=' + row.original.id + '&' + row.original.app.utm_source
            + '&isLanding=' + landings[0].landing.isLanding + '&landing_id=' + landings[0].landing.id
        }
      }

      return <TableCell>
        <span
          className="underline cursor-pointer"
          title="Скопировать"
          onClick={() => {
            navigator.clipboard.writeText(result).then(() => alert.success('Ссылка скопирована'))
          }}
        >
          {result}
        </span>
      </TableCell>
    }
  },
  {
    Header: "Редирект",
    accessor: "redirect",
    width: 100,
    Cell: ({row}: any) => <p
      className="p-1 rounded cursor-default w-12 text-center"
      style={{
        background: row.original.redirect ? "#F7FAED" : '#FFF2F7',
        color: row.original.redirect ? '#8BA63A' : '#CC5C81'
      }}
    >{row.original.redirect ? 'да' : 'нет'}</p>
  },
  {
    Header: "Редактировать",
    accessor: "edit",
    width: 200,
    Cell: ({row}: any) => {
      if (row.original.id) return <div className="flex cursor-pointer" onClick={() => {
        updateLanding(row.original)
      }}>
        <span className="material-icons mr-2 my-auto">edit</span>
        <span className="my-auto truncate">Редактировать</span>
      </div>
      return null
    }
  },
]

export default header_table_landing