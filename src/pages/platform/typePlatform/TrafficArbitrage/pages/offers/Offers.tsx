//core
import React, {useMemo, useState} from "react";
import {useParams} from "react-router-dom";
import {useAlert} from "react-alert";
import {useMutation, useQuery} from "@apollo/client";

//components
import Table, {TableOptions} from "@pages/platform/components/table/Table";
import header_table_offers from "./header.table.offers";
import Modal from "@pages/platform/typePlatform/TrafficArbitrage/pages/offers/Modal";
import ModalOfferTrafficManager from "@pages/platform/typePlatform/TrafficArbitrage/pages/offers/Modal.trafficManager";

//interface
import {URL_PARAMS} from "@pages/platform/Platform";

//requests
import GetListOffer from "@gql/Offers/getListOffers.gql";
import DeleteOffer from "@gql/Offers/deleteOffer.gql";

interface IOffersPage {
    user: IUser
}
const Offers: React.FC<IOffersPage> = ({user}) => {
    //initial
    let offers: IOffer[] = []
    let pageCount = 1
    let rowCount = 0

    let params: URL_PARAMS = useParams();
    const alert = useAlert();

    const [[pageIndex, pageSize, sortBy], setPaginationParams] = useState([0, 100, []])

    const initOffer: IOffer = {}

    const [addOffer, setAddOffer] = useState(initOffer)

    const [showModal, setShowModal] = useState(false)
    const [modalType, setModalType] = useState('add')
    const [deleteMutation] = useMutation(DeleteOffer);
    const [deleteArray, setDeleteArray] = useState([])

    //get list Offers
    let {loading, data, refetch} = useQuery(GetListOffer, {
        variables: {
            platformName: params.platformId,
            pagination: {pageIndex, pageSize, sortBy}
        }
    });

    //update Worker
    const updateData = (data: any) => {
        setModalType("update")
        setAddOffer(data)
        setShowModal(true)
    }

    //delete offers
    const deleteData = () => {
        const data = deleteArray.map(el => el.values.id)
        deleteMutation({
            variables: {
                deleteOfferData: {
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
        offers = data.getListOffers.offers
        pageCount = Math.ceil(data.getListOffers.count / pageSize)
        rowCount = data.getListOffers.count
    }

    const columns = useMemo(() => header_table_offers(updateData), [])

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
    }

    if(
      user.group === 'CLIENT' ||
      user.group === 'CLIENT_ADMIN' ||
      user.group === 'CLIENT_TEAM_LEAD'
    ){
        table_options.delete = {
            onClick: deleteData,
            setData: setDeleteArray
        }
        table_options.add = () => {
            setModalType("add")
            setAddOffer(initOffer)
            setShowModal(true)
        };
    }


    let modal_jsx =  <Modal
      show={showModal}
      showModal={setShowModal}
      offer={addOffer}
      refetch={refetch}
      type={modalType}
      user={user}
    />

    if(user.group === 'CLIENT_TRAFFIC_MANAGER'){
        modal_jsx = <ModalOfferTrafficManager
          show={showModal}
          showModal={setShowModal}
          offer={addOffer}
          refetch={refetch}
          type={modalType}
          user={user}
        />
    }

    return (
        <>
            <div>
                <span className="text-2xl font-bold">Управление офферами</span>
            </div>
            <div>
                <Table
                    columns={columns}
                    data={offers}
                    options={table_options}
                />
            </div>
            {modal_jsx}
        </>
    )
}

export default Offers