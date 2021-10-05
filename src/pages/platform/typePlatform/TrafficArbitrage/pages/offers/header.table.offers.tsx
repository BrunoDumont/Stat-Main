//core
import React, {useState} from "react";
import clsx from "clsx";
import Popover from "react-popover";


const header_table_offers = (updateOffer: (offer: IOffer) => void) => [
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
    },
    {
        Header: "Статус",
        accessor: "status",
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
        Header: "Редактировать",
        accessor: "edit",
        Cell: ({row}: any) => {
            if (row.original.id) return <div className="flex cursor-pointer" onClick={() => {
                updateOffer(row.original)
            }}>
                <span className="material-icons mr-2 my-auto">edit</span>
                <span className="my-auto truncate">Редактировать</span>
            </div>
            return null
        }
    },
]

export default header_table_offers