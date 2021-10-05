//core
import React from "react";
import clsx from "clsx";

//components
import TableCell from "@pages/platform/components/table.cell/TableCell";

//functions
import {to_datetime_format} from "@core/workWithDate";

//types
import {leadStatus} from "@pages/platform/typePlatform/TrafficArbitrage/pages/leads/Leads";


const header_table_leads = () => {
  return [
    {
      Header: "ID",
      accessor: "id",
      width: 100,
      search: {
        searchField: true,
        // defaultValues: {
        //   '1grthsrth45hwrabthsrtj45hbdfh': false,
        //   "2": true
        // }
      },
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
      Header: "Выплата",
      accessor: "payment",
    },
    {
      Header: "Дубль",
      accessor: "isDouble",
      Cell: ({row}: any) => {
        return <span
          className="p-1 text-sm my-auto rounded"
          style={{
            background: !row.original.isDouble ? "#F7FAED" : '#FFF2F7',
            color: !row.original.isDouble ? '#8BA63A' : '#CC5C81'
          }}
        >
                    {(row.original.isDouble ? "Да" : "Нет")}
                </span>
      },
      search: {
        // searchField: true,
        defaultValues: {
          'Да': false,
          "Нет": false
        }
      },
    },
    {
      Header: "Время создания",
      accessor: "date_create",
      Cell: ({row}: any) => {
        return <TableCell>{to_datetime_format(new Date(row.original.date_create))}</TableCell>
      }
    },
    {
      Header: "Оффер",
      accessor: "offer",
      Cell: ({row}: any) => {
        const name = row.original.offer ? row.original.offer.name : row.original.offer_name
        return <TableCell>{name}</TableCell>
      }
    },
    {
      Header: "Прелендинг",
      accessor: "prelanding",
      Cell: ({row}: any) => {
        const name = row.original.prelanding ? row.original.prelanding.name : row.original.prelanding_name
        return <TableCell>{name}</TableCell>
      }
    },
    {
      Header: "Лендинг",
      accessor: "landing",
      Cell: ({row}: any) => {
        const name = row.original.landing ? row.original.landing.name : row.original.landing_name
        return <TableCell>{name}</TableCell>
      }
    },
    {
      Header: "Поток",
      accessor: "flow",
      Cell: ({row}: any) => {
        const name = row.original.flow ? row.original.flow.name : row.original.flow_name
        return <TableCell>{name}</TableCell>
      }
    },
    {
      Header: "ГЕО",
      accessor: "geo",
      Cell: ({row}: any) => {
        return <TableCell>{row.original.geo}</TableCell>
      }
    },
    {
      Header: "ПП",
      accessor: "pp",
      Cell: ({row}: any) => {
        const name = row.original.pp ? row.original.pp.name : '-'
        return <TableCell>{name}</TableCell>
      }
    },
    {
      Header: "Источник",
      accessor: "app",
      Cell: ({row}: any) => {
        const name = row.original.app ? row.original.app.name : '-'
        return <TableCell>{name}</TableCell>
      }
    },
    {
      Header: "Имя",
      accessor: "name",
      Cell: ({row}: any) => {
        return <TableCell>{row.original.name}</TableCell>
      }
    },
    {
      Header: "Телефон",
      accessor: "phone",
      Cell: ({row}: any) => {
        return <TableCell>{row.original.phone}</TableCell>
      }
    },
    {
      Header: "Возраст/ дата рождения",
      accessor: "birth",
      Cell: ({row}: any) => {
        return <TableCell>{row.original.birth}</TableCell>
      }
    },
    {
      Header: "Комментарий",
      accessor: "comment",
      Cell: ({row}: any) => {
        return <TableCell>{row.original.comment}</TableCell>
      }
    },
    {
      Header: "Траффик-менеджер",
      accessor: "user",
      Cell: ({row}: any) => {
        const value = row.original.user && row.original.user.group === 'CLIENT_TRAFFIC_MANAGER'
          ? row.original.user.username
          : ''
        return <TableCell>{value}</TableCell>
      }
    },
    {
      Header: "Тимлид",
      accessor: "user_parent",
      Cell: ({row}: any) => {
        let value = row.original.user && row.original.user.parent
          ? row.original.user.parent.username
          : ''
        if (row.original.user && row.original.user.group === 'CLIENT_TEAM_LEAD') {
          value = row.original.user.username
        }
        return <TableCell>{value}</TableCell>
      }
    },
    {
      Header: "Кампания",
      accessor: "campaign_name",
      Cell: ({row}: any) => {
        return <TableCell>{row.original.campaign_name}</TableCell>
      }
    },
    {
      Header: "Группа объявлений",
      accessor: "adset_name",
      Cell: ({row}: any) => {
        return <TableCell>{row.original.adset_name}</TableCell>
      }
    },
    {
      Header: "Объявление",
      accessor: "ad_name",
      Cell: ({row}: any) => {
        return <TableCell>{row.original.ad_name}</TableCell>
      }
    },
    {
      Header: "Статус",
      accessor: "status",
      Cell: ({row}: any) => {

        const status: keyof typeof leadStatus = row.original.status
        const styles = {
          'NEW': {
            background: '#f2fdff',
            color:'#5caccc'
          },
          'ACCEPT': {
            background: "#F7FAED",
            color: '#8BA63A'
          },
          'WAIT': {
            background: '#FFF2F7',
            color: '#ccac5c'
          },
          'AVOID': {
            background: '#FFF2F7',
            color: '#CC5C81'
          },
        }
        const value = leadStatus[status]
        return <span
          className="p-1 text-sm my-auto rounded truncate"
          style={styles[status]}
        >
          {value}
        </span>
      }
    },
    {
      Header: "Дата статуса",
      accessor:
        "date_status",
      Cell:
        ({row}: any) => {
          if (row.original.date_status) {
            return <TableCell>{to_datetime_format(new Date(row.original.date_status))}</TableCell>
          }
          return '-'
        }
    },
  ]
}

export default header_table_leads