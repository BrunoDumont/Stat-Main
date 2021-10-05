//core
import React, {useMemo, useState} from "react";
import {useParams} from "react-router-dom";
import {useAlert} from "react-alert";
import {useQuery} from "@apollo/client";

//components
import Table, {TableOptions} from "@pages/platform/components/table/Table";
import header_table_leads from "./header.table.leads";

//interface
import {URL_PARAMS} from "@pages/platform/Platform";

//requests
import GetListLeads from "@gql/Leads/getListLeads.gql";

interface ILeadsPage {
  user: IUser
}

export const leadStatus = {
  'NEW': 'Новый',
  'ACCEPT': 'Принят',
  'WAIT': 'В ожидании',
  'AVOID': 'Отклонен'
}
const Leads: React.FC<ILeadsPage> = ({user}) => {
  //initial
  let leads: ILead[] = []
  let pageCount = 1
  let rowCount = 0

  let params: URL_PARAMS = useParams();
  const alert = useAlert();
  const [dateRange, setDateRange] = useState({
    date_start: new Date(),
    date_end: new Date()
  })
  const [[pageIndex, pageSize, sortBy], setPaginationParams] = useState([0, 100, []])

  //get list Leads
  let {loading, data, refetch} = useQuery(GetListLeads, {
    variables: {
      platformName: params.platformId,
      pagination: {pageIndex, pageSize, sortBy},
      dateRange: dateRange
    }
  });

  //update Worker
  // const updateData = (data: any) => {
  //     setModalType("update")
  //     setAddOffer(data)
  //     setShowModal(true)
  // }

  //delete offers
  // const deleteData = () => {
  //     const data = deleteArray.map(el => el.values.id)
  //     deleteMutation({
  //         variables: {
  //             deleteOfferData: {
  //                 id: data
  //             }
  //         }
  //     }).then(() => {
  //         refetch().then(() => {
  //             alert.success("Данные удалены");
  //         })
  //     })
  // }

  if (data) {
    leads = data.getListLeads.leads
    pageCount = Math.ceil(data.getListLeads.count / pageSize)
    rowCount = data.getListLeads.count
  }

  const columns = useMemo(() => header_table_leads(), [])

  const table_options: TableOptions = {
    width: window.innerWidth - 112,
    selected: true,
    loading,
    pageIndex,
    pageCount,
    rowCount,
    sortBy: [{id: "id", desc: true}],
    getSubRows: (row: any) => {
      return row.children || []
    },
    getPaginationParams: setPaginationParams,
    dateRange: {
      defaultValue: 'today',
      setDateRange
    },
    template: 'leads'
  }

  return (
    <>
      <div className="flex">
        <span className="text-2xl font-bold">Управление лидами</span>
        <div className="ml-auto flex">
          <span className="w-8 h-8 flex rounded" style={{ backgroundColor: '#E6E6EB'}}>
            <i
              className="material-icons m-auto cursor-pointer "
              style={{color: '#7E7E8C'}}
              onClick={() => {
                refetch()
              }}
            >cached</i>
          </span>
        </div>

      </div>
      <div>
        <Table
          columns={columns}
          data={leads}
          options={table_options}
        />
      </div>
    </>
  )
}

export default Leads