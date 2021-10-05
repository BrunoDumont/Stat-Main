//core
import React, {useMemo, useState} from "react";
import {useParams} from "react-router-dom";
import {useAlert} from "react-alert";
import {useMutation, useQuery} from "@apollo/client";

//components
import Table from "@pages/platform/components/table/Table";
import Modal from "@pages/platform/typePlatform/TrafficArbitrage/pages/tools/prelandings/Modal";
import header_table_landing from "../landings/header.table.landings";

//interface
import {URL_PARAMS} from "@pages/platform/Platform";

//requests
import GetListLandings from "@gql/tools/landings/getListLandings.gql";
import DeleteLanding from "@gql/tools/landings/deleteLanding.gql";

const Prelandings: React.FC = () => {
    //initial
    let landings = []
    let pageCount = 1
    let rowCount = 0

    let params: URL_PARAMS = useParams();
    const alert = useAlert();

    const [[pageIndex, pageSize, sortBy], setPaginationParams] = useState([0, 100, []])

    const initLanding: ILanding = {
        name: '',
        url: '',
        isLanding: false,
        platform: {
            platformName: params.platformId
        }
    }

    const [addLanding, setAddLanding] = useState(initLanding)

    const [showModal, setShowModal] = useState(false)
    const [modalType, setModalType] = useState('add')
    const [deleteMutation] = useMutation(DeleteLanding);
    const [deleteArray, setDeleteArray] = useState([])

    //get list Landings
    let {loading, data, refetch} = useQuery(GetListLandings, {
        variables: {
            platformName: params.platformId,
            pagination: {pageIndex, pageSize, sortBy},
            isLanding: false
        }
    });

    //update Landing
    const updateData = (data: any) => {
        setModalType("update")
        setAddLanding(data)
        setShowModal(true)
    }

    //delete landings
    const deleteData = () => {
        const cantDelete: string[] = []
        const data = deleteArray
          .filter(el => {
              const lbf = !el.original.landingsByFlow.find((lbf: any) => lbf.useInFlow);
              if(!lbf) cantDelete.push(el.original.name)
              return !lbf
          })
          .map(el => el.values.id)
        if(cantDelete.length > 0){
            alert.info(`Лендинги ${cantDelete.join(', ')} не могут быть удалены, потому что используются в потоках`)
        }
        deleteMutation({
            variables: {
                deleteLandingData: {
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
        landings = data.getListLandings.landings
        pageCount = Math.ceil(data.getListLandings.count / pageSize)
        rowCount = data.getListLandings.count
    }

    const columns = useMemo(() => header_table_landing(updateData, alert), [])

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
            setAddLanding(initLanding)
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
                <span className="text-2xl font-bold">Управление прелендингами</span>
            </div>
            <div>
                <Table
                    columns={columns}
                    data={landings}
                    options={table_options}
                />
            </div>
            <Modal
                show={showModal}
                showModal={setShowModal}
                landing={addLanding}
                refetch={refetch}
                type={modalType}
            />
        </>
    )
}

export default Prelandings