//core
import React, {useMemo, useState} from "react";
import {useMutation, useQuery} from "@apollo/client";
import {useParams} from "react-router-dom";
import {useAlert} from "react-alert";

//components
import Table from "@pages/platform/components/table/Table";
import ModalAdmin from "@pages/platform/typePlatform/TrafficArbitrage/pages/controlPersonal/modals/Modal_admin"
import header_table_personals from "./header.table.personals";

//request
import GetListWorker from "@gql/ControlPerson/getListWorker.gql";
import DeleteWorker from "@gql/ControlPerson/deleteWorker.gql";

//types
import {URL_PARAMS} from "@pages/platform/Platform";
import ModalTeamLead from "@pages/platform/typePlatform/TrafficArbitrage/pages/controlPersonal/modals/Modal_teamlead";
import header_table_personals_teamLead
    from "@pages/platform/typePlatform/TrafficArbitrage/pages/controlPersonal/header.table.personals.teamlead";

export type UserGroupType = {
    CLIENT_ADMIN: string,
    CLIENT_TEAM_LEAD: string,
    CLIENT_TRAFFIC_MANAGER: string,
}

export const user_group: UserGroupType = {
    CLIENT_ADMIN: 'Администратор',
    CLIENT_TEAM_LEAD: 'Тимлид',
    CLIENT_TRAFFIC_MANAGER: 'Траффик-менеджер',
}

export interface IControlPerson extends Omit<IUser, 'group'|'platform'|'parent'|'children'> {
    platform?: string
    status?: boolean
    password?: string
    password_control?: string
    group?: keyof UserGroupType
    offerByUser?: IOfferByUser[]
    children?: IControlPerson[]
    parent?: IControlPerson
}

interface IControlPersonal {
    user: IUser
}

const ControlPersonal: React.FC<IControlPersonal> = ({user}) => {
    //initial
    let persons: IControlPerson[] = []
    let pageCount: number = 1
    let rowCount: number = 0

    let params: URL_PARAMS = useParams();
    const alert = useAlert();

    const [[pageIndex, pageSize, sortBy], setPaginationParams] = useState([0, 100, []])

    const initUser: IControlPerson = {
        platform: params.platformId,
        username: '',
        email: '',
        password: '',
        password_control: '',
        status: true,
        group: 'CLIENT_TRAFFIC_MANAGER',
    }
    const [addUser, setAddUser] = useState(initUser)

    const [showModal, setShowModal] = useState(false)
    const [modalType, setModalType] = useState('add')
    const [deleteMutation] = useMutation(DeleteWorker);
    const [deleteArray, setDeleteArray] = useState([])

    //get list Worker
    let {loading, data, refetch} = useQuery(GetListWorker, {
        variables: {
            platformName: params.platformId,
            pagination: {pageIndex, pageSize, sortBy}
        }
    });

    //update Worker
    const updateData = (data: any) => {
        setModalType("update")
        setAddUser({...data, platform: params.platformId})
        setShowModal(true)
    }

    //delete workers
    const deleteData = () => {
        let data = deleteArray
        if(user.group === 'CLIENT_TEAM_LEAD'){
            data = data.filter(el => el.values.group === 'CLIENT_TRAFFIC_MANAGER' || el.values.id === user.id)
        }
        data = data.map(el => el.values.id)

        deleteMutation({
            variables: {
                deleteWorkerData: {
                    id: data
                }
            }
        }).then(() => {
            alert.success("Данные удалены");
            refetch().then(() => {
            })
        })
    }

    if (data) {
        persons = data.getListWorker.users
        pageCount = Math.ceil(data.getListWorker.count / pageSize)
        rowCount = data.getListWorker.count
    }
    const columns = useMemo(() => {
        return user.group === 'CLIENT_TEAM_LEAD'
          ? header_table_personals_teamLead(updateData, user)
          : header_table_personals(updateData)

    }, [])

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
            setAddUser(initUser)
            setShowModal(true)
        },
        delete: {
            onClick: deleteData,
            setData: setDeleteArray
        }
    }

    let modal_jsx = <ModalAdmin
        show={showModal}
        showModal={setShowModal}
        user={addUser}
        refetch={refetch}
        type={modalType}
    />

    if (user.group === "CLIENT_TEAM_LEAD") {
        modal_jsx = <ModalTeamLead
            show={showModal}
            showModal={setShowModal}
            user={addUser}
            refetch={refetch}
            type={modalType}
        />
    }

    return (
        <>
            <div>
                <span className="text-2xl font-bold">Управление сотрудниками</span>
            </div>
            <div>
                <Table
                    columns={columns}
                    data={persons}
                    options={table_options}
                />
            </div>
            {modal_jsx}
        </>
    )
}

export default ControlPersonal