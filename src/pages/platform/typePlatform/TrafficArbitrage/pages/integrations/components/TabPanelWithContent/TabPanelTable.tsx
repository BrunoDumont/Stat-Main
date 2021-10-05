//core
import React, {useEffect, useMemo, useState} from "react";
import {useExpanded, useRowSelect, useTable} from "react-table";
import Popover from "react-popover";
import Moment from "react-moment";
import clsx from "clsx";
import {CSSTransition, TransitionGroup} from "react-transition-group";
import {useLazyQuery, useMutation} from "@apollo/client";
import {useAlert} from "react-alert";

//components
import CheckBox from "@components/Base/CheckBox";

//requests
import SetCabinetForGetStatistic from "@gql/Integration/setCabinetForGetStatistic.gql";
import GetAccountsStatus from "@gql/Integration/getAccountsStatus.gql";
//styles
import './tabPanelTable.css'


interface ITabPanelTable {
    data: any[]
    setSelectedRows: (arg0: any[]) => void
}

const TabPanelTable: React.FC<ITabPanelTable> = ({data, setSelectedRows}) => {
    const alert = useAlert();
    const [showPopover, setShowPopover] = useState('')
    const [factorValues, setFactorValue] = useState({})
    const [accountConnection, setAccountConnection]: [{[key: number]: boolean}, (arg0: object) => void] = useState({})

    const [getStatusAccounts, statusAccounts] = useLazyQuery(GetAccountsStatus, {
        fetchPolicy: "network-only"
    })

    //for test status FB account
    useEffect(() => {
        getStatusAccounts({
            variables: {
                accounts_id: data.map(el => el.id)
            }
        })
    }, [])

    useEffect(() => {
        if (statusAccounts.data) {
            setAccountConnection(statusAccounts.data.getAccountsStatus
                .reduce((acc: any, el: any) => {
                    if (!el.status) {
                        const account = data.find(acc => acc.id === el.id);
                        alert.error(`Аккаунт ${account.name} недоступен`)
                    }
                    return {...acc, [el.id]: el.status}
                }, {}))
        }
    }, [statusAccounts.data])

    useEffect(() => {
        const factors: { [key: number]: number } = {}
        data.forEach(account => {
            account.cabinets && account.cabinets.forEach((cabinet: IIntegrationCabinet) => {
                factors[cabinet.id] = cabinet.factor
            })
        })
        setFactorValue(factors)
    }, [data])

    const [expandedRows, setExpandedRow] = useState({})
    const [selectedRowsInit, setSelectedRowsInit] = useState([])
    const [getStatisticMutation] = useMutation(SetCabinetForGetStatistic);
    const columns = useMemo(() => [{Header: 'Column 1', accessor: 'id'}], [])

    const {
        selectedFlatRows,
        rows,
        prepareRow,
        state: {selectedRowIds, expanded},
    } = useTable({
        columns,
        data,
        getSubRows: (row: any) => {
            return row.cabinets || []
        },
        initialState: {
            expanded: expandedRows,
            selectedRowIds: selectedRowsInit
        }
    }, useExpanded, useRowSelect)

    useEffect(() => {
        setSelectedRows(selectedFlatRows)
        setSelectedRowsInit(selectedRowIds)
    }, [selectedRowIds])

    useEffect(() => {
        setExpandedRow(expanded)
    }, [expanded])

    if (data.length === 0) return <p className="text-center">У Вас нет интегрируемых аккаунтов</p>

    return <TransitionGroup className="rounded bg-white p-4 divide-y">
        {
            rows.map((row) => {
                prepareRow(row)
                return (
                    <CSSTransition key={row.id} timeout={100} classNames="fade">
                        <div className="flex py-2">
                            <div className="w-8 flex">
                                {
                                    row.canExpand
                                        ? (
                                            <span
                                                className={clsx("material-icons ml-2 transition duration-500 ease-in-out", {'transform rotate-180 ': row.isExpanded})}
                                                {...row.getToggleRowExpandedProps()}
                                            >
                                                expand_more
                                            </span>
                                        ) : null
                                }
                            </div>
                            <CheckBox
                                className={clsx("m-1", {"ml-6": row.original.__typename === 'CabinetIntegration'})}
                                type="indeterminate" {...row.getToggleRowSelectedProps()}
                            />
                            {
                                row.original.hasOwnProperty('token') &&
                                <>
                                    <span className="my-auto ml-1">{row.original.name}</span>
                                    <Popover
                                        className="z-20"
                                        body={<div
                                            className=" rounded p-4 bg-black bg-opacity-75 text-white z-20">
                                            Владелец: {row.original.user.username}
                                        </div>}
                                        isOpen={showPopover === row.original.name}
                                    >
                                            <span
                                                onMouseEnter={() => setShowPopover(row.original.name)}
                                                onMouseLeave={() => setShowPopover('')}
                                                className="ml-1 cursor-pointer material-icons text-gray-500 text-sm"
                                            >
                                                    help
                                            </span>
                                    </Popover>
                                    <div className="ml-auto flex">
                                        <span className="mr-1 my-auto hidden sm:block">Обновлен: </span>
                                        <Moment
                                            className="my-auto mr-2"
                                            format="D MMM YYYY"
                                            locale="ru"
                                        >
                                            {row.original.token_date_update}
                                        </Moment>

                                        <span
                                            className={clsx('mr-1 h-4 w-4 rounded-full my-auto', {
                                                'animate-pulse': typeof accountConnection[row.original.id] === 'undefined'
                                            })}
                                            style={{
                                                background: accountConnection[row.original.id]
                                                    ? '#8BA63A'
                                                    : '#CC5C81'
                                            }}
                                        />


                                    </div>
                                </>
                            }
                            {
                                row.original.hasOwnProperty('access_get_statistic') &&
                                <div className="flex w-full">
                                    <span>
                                        {row.original.name} x
                                    </span>
                                    <input
                                        value={factorValues[row.original.id]}
                                        className="px-1 ml-1 w-14 border rounded outline-none whitespace-nowrap"
                                        onKeyPress={(e) => {
                                            const x = e.charCode || e.keyCode;
                                            if (isNaN(String.fromCharCode(e.which)) && x != 46 || x === 32 || x === 13 || (x === 46 && e.target.value.includes('.'))) e.preventDefault();
                                        }}
                                        onChange={(e) => {
                                            const value = e.target.value
                                            const split = value.split('.')
                                            if (Number(split[0]) <= 100 && !(split.length === 2 && Number(split[1]) >= 100)) {
                                                setFactorValue(prev => ({
                                                        ...prev,
                                                        [row.original.id]: value
                                                    })
                                                )
                                            }
                                        }}
                                        onBlur={(e) => {
                                            const value = e.target.value;
                                            getStatisticMutation({
                                                variables: {
                                                    cabinet_id: row.original.id,
                                                    factor: Number(value),
                                                    value: row.original.access_get_statistic
                                                }
                                            })
                                        }}
                                    />
                                    <CheckBox
                                        className="ml-auto my-auto mr-2"
                                        checked={row.original.access_get_statistic}
                                        onChange={(e) => {
                                            getStatisticMutation({
                                                variables: {
                                                    cabinet_id: row.original.id,
                                                    factor: row.original.factor,
                                                    value: e.target.checked
                                                }
                                            })
                                        }}
                                    />
                                    <span className="hidden sm:block">Получать статистику?</span>
                                </div>
                            }
                        </div>
                    </CSSTransition>
                )
            })
        }
    </TransitionGroup>
}

export default TabPanelTable