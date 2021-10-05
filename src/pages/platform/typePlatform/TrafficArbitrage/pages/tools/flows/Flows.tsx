//core
import React, {useMemo, useState} from "react";
import {useParams} from "react-router-dom";
import {useAlert} from "react-alert";
import {useMutation, useQuery} from "@apollo/client";

//components
import Table from "@pages/platform/components/table/Table";
import header_table_flow from "./header.table.flows";
import Modal from "@pages/platform/typePlatform/TrafficArbitrage/pages/tools/flows/Modal";

//interface
import {URL_PARAMS} from "@pages/platform/Platform";

//requests
import GetListFLows from "@gql/tools/flows/getListFlows.gql";
import DeleteFlow from "@gql/tools/flows/deleteFlow.gql";

const Flows: React.FC = () => {
    //initial
    let flows = []
    let pageCount = 1
    let rowCount = 0

    let params: URL_PARAMS = useParams();
    const alert = useAlert();

    const [[pageIndex, pageSize, sortBy], setPaginationParams] = useState([0, 100, []])

    const initFlow: IFlow = {
        name: '',
        redirect: false,
        platform: {
            platformName: params.platformId
        },
        landingsByFlow: []
    }

    const [addFlow, setAddFlow] = useState(initFlow)

    const [showModal, setShowModal] = useState(false)
    const [modalType, setModalType] = useState('add')
    const [deleteMutation] = useMutation(DeleteFlow);
    const [deleteArray, setDeleteArray] = useState([])

    //get list Landings
    let {loading, data, refetch} = useQuery(GetListFLows, {
        variables: {
            platformName: params.platformId,
            pagination: {pageIndex, pageSize, sortBy},
        }
    });

    //update Flow
    const updateData = (data: any) => {
        setModalType("update")
        setAddFlow(data)
        setShowModal(true)
    }

    //delete flows
    const deleteData = () => {
        const data = deleteArray.map(el => el.values.id)
        deleteMutation({
            variables: {
                deleteFlowData: {
                    id: data
                }
            }
        }).then(() => {
            refetch().then(() => {
                alert.success("Данные удалены");
            })
        })
    }

    if (data) {
        flows = data.getListFlows.flows
        pageCount = Math.ceil(data.getListFlows.count / pageSize)
        rowCount = data.getListFlows.count
    }

    const columns = useMemo(() => header_table_flow(updateData, alert), [])

    const table_options = {
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
        add: () => {
            setModalType("add")
            setAddFlow(initFlow)
            setShowModal(true)
        },
        delete: {
            onClick: deleteData,
            setData: setDeleteArray
        }
    }

    return (
        <>
            <div>
                <span className="text-2xl font-bold">Управление потоками</span>
            </div>
            <div>
                <Table
                    columns={columns}
                    data={flows}
                    options={table_options}
                />
            </div>
            <Modal
                show={showModal}
                showModal={setShowModal}
                flow={addFlow}
                refetch={refetch}
                type={modalType}
            />
        </>
    )
}

export default Flows