//core
import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {useMutation, useQuery} from "@apollo/client";
import {useAlert} from "react-alert";

//components
import {Input} from "@components/Base/Input";
import {Selector} from "@components/Base/Selector";
import {Button} from "@components/Base/Button";

//interfaces
import MyModal, {IModalProps} from "@components/Modal/Modal";
import {URL_PARAMS} from "@pages/platform/Platform";

//request
import GetListWorker from "@gql/ControlPerson/getListWorker.gql";
import GetListOffers from "@gql/Offers/getListOffers.gql";
import AddWorker from "@gql/ControlPerson/addWorker.gql";
import UpdateWorker from "@gql/ControlPerson/updateWorker.gql";

//types
import {IControlPerson} from "@pages/platform/typePlatform/TrafficArbitrage/pages/controlPersonal/СontrolPersonal";

interface IModalAdmin extends IModalProps {
    user: IControlPerson
    refetch: () => void
    type: string
}

type ErrorType = {
    error: string
    type: string
}

const test_user = (user: IControlPerson, type?: string) => {
    if (user.username.length < 3) return {
        'type': 'username',
        'error': 'Введите имя'
    }
    if (!user.email.includes('@') || !user.email.includes('.')) return {
        'type': 'email',
        'error': 'Введите корректный email'
    }
    if (user.password !== user.password_control) return {
        'type': 'password',
        'error': 'Пароли не совпадают'
    }
    if (((type === 'edit' && user.password) || type === 'add') && user.password.length < 8) return {
        'type': 'password',
        'error': 'Пароль должен иметь длину от 8 символов'
    }
    return true
}

const prepare_data = (data: IControlPerson) => {
    if (data.children) data.children = data.children.map((el) => ({"id": el.id}))
    if (data.parent) data.parent = {"id": data.parent.id}
    if (data.offerByUser) data.offerByUser = data.offerByUser.map(el => ({ offer: { id: el.offer.id}}))
}

const ModalTeamLead: React.FC<IModalAdmin> = ({show, showModal, user, refetch, type}) => {
    const [modalUser, setModalUser] = useState(user)

    const alert = useAlert();
    let params: URL_PARAMS = useParams();
    const [addWorkerMutation] = useMutation(AddWorker);
    const [updateWorkerMutation] = useMutation(UpdateWorker);
    const [error, setError]: [ErrorType, (arg0: ErrorType) => void] = useState({
        type: '', error: ''
    })

    let {loading, data} = useQuery(GetListWorker, {
        variables: {
            platformName: params.platformId,
            pagination: {pageIndex: 0, pageSize: 1000, sortBy: {"id": "username", desc: true}}
        },
        fetchPolicy: "network-only"
    });

    let listOffers = useQuery(GetListOffers, {
        variables: {
            platformName: params.platformId,
            pagination: {pageIndex: 0, pageSize: 1000, sortBy: {"id": "name", desc: true}}
        }
    });

    let userSelector: IControlPerson[] = []
    let offersSelector: IOffer[] = []

    if (data) {
        userSelector = data.getListWorker.users
    }

    if (listOffers.data) {
        offersSelector = listOffers.data.getListOffers.offers
    }

    useEffect(() => {
        setModalUser(user)
    }, [user])

    useEffect(() => {
        setError({type: '', error: ''})
    }, [show])


    const addUser = (e: React.FormEvent) => {
        e.preventDefault()
        const test = test_user(modalUser, 'add')
        if (test === true) {
            let {password_control, ...data} = modalUser
            prepare_data(data)
            addWorkerMutation({
                variables: {
                    addWorkerData: data
                }
            }).then(() => {
                refetch()
                showModal(false)
                alert.success("Данные успешно добавлены")
            }).catch(e => setError({
                type: 'email',
                error: e.message
            }))
        } else {
            setError(test)
        }
    }

    const updateUser = (e: React.FormEvent) => {
        e.preventDefault()
        const test = test_user(modalUser, 'edit')
        if (test === true) {
            let {password_control, ...data} = modalUser
            prepare_data(data)
            updateWorkerMutation({
                variables: {
                    updateWorkerData: data
                }
            }).then(() => {
                refetch()
                showModal(false)
                alert.success("Данные успешно изменены")
            })
        } else {
            setError(test)
        }
    }

    return (
        <MyModal show={show} showModal={showModal}>
            <form onSubmit={(e) => type === 'add' ? addUser(e) : updateUser(e)}>
                <p className="flex border-b pb-2">
                    <span className="font-semibold text-xl ">
                        {
                            type === 'add' ? "Добавление данных" : "Изменение данных"
                        }
                    </span>
                    <span className="material-icons ml-auto my-auto cursor-pointer text-gray-600"
                          onClick={() => showModal(false)}>
                        close
                    </span>
                </p>
                <div className="mt-4 border-b pb-4">
                    <p className="text-left mt-4">Имя пользователя</p>
                    <Input
                        className="mx-0 my-2"
                        placeholder="Введите имя ..."
                        value={modalUser.username}
                        setValue={(data) => {
                            setModalUser({...modalUser, username: data})
                            setError({type: '', error: ''})
                        }}
                    />
                    {
                        error.type === 'username' && <span className="text-red-500 text-sm">{error.error}</span>
                    }
                    <p className="text-left mt-4">Email</p>
                    <Input
                        className="mx-0 my-2"
                        placeholder="Введите email ..."
                        value={modalUser.email}
                        setValue={(data) => {
                            setModalUser({...modalUser, email: data})
                            setError({type: '', error: ''})
                        }}
                    />
                    {
                        error.type === 'email' && <span className="text-red-500 text-sm">{error.error}</span>
                    }

                    <p className="text-left mt-4">Пароль</p>
                    <Input
                        className="mx-0 my-2"
                        placeholder="Введите пароль"
                        type="password"
                        value={modalUser.password}
                        setValue={(data) => {
                            setModalUser({...modalUser, password: data})
                            setError({type: '', error: ''})
                        }}
                    />
                    <Input
                        className="mx-0 my-2"
                        placeholder="Повторите пароль"
                        type="password"
                        value={modalUser.password_control}
                        setValue={(data) => {
                            setModalUser({...modalUser, password_control: data})
                            setError({type: '', error: ''})
                        }}
                    />
                    {
                        error.type === 'password' && <span className="text-red-500 text-sm">{error.error}</span>
                    }
                    <p className="text-left mt-4">Статус</p>
                    <Selector
                        type="modal"
                        value={{value: modalUser.status, label: (modalUser.status ? 'Активный' : 'Неактивный')}}
                        onChange={({value}) => setModalUser({...modalUser, status: Boolean(value)})}
                        options={[true, false].map(status => {
                            return {value: status, label: (status ? 'Активный' : 'Неактивный')}
                        })}
                    />
                    {
                        modalUser.group === 'CLIENT_TRAFFIC_MANAGER' && !loading && <>
                            <p className="text-left mt-4">Тимлид</p>
                            <Selector
                              type="modal"
                              value={modalUser.parent && ({
                                  value: modalUser.parent.id,
                                  label: modalUser.parent.username
                              })}
                              onChange={({value}) => {
                                  const parentUser = userSelector.find(el => el.id === value)
                                  setModalUser({...modalUser, parent: parentUser})
                              }}
                              options={userSelector
                                .filter(el => el.group === 'CLIENT_TEAM_LEAD')
                                .map(el => ({value: el.id, label: el.username}))
                              }
                            />
                        </>
                    }
                    {
                        modalUser.group === 'CLIENT_TRAFFIC_MANAGER' && !listOffers.loading && <>
                            <p className="text-left mt-4">Офферы</p>
                            <Selector
                              type="modal"
                              isMulti={true}
                              value={
                                  modalUser.offerByUser
                                    ? modalUser.offerByUser.map(el => ({value: el.offer.id, label: el.offer.name}))
                                    : []
                              }
                              onChange={(data) => {
                                  const offerArr = data.map(({value}: { value: number }) => {
                                      return {
                                          offer: offersSelector.find(el => el.id === value) || modalUser.offerByUser.find(el => el.offer.id === value),
                                      }
                                  })
                                  setModalUser({...modalUser, offerByUser: offerArr})
                              }}
                              options={offersSelector
                                .filter(el => el.offerByUser.filter(offer => offer.user.username === modalUser.username).length === 0)
                                .map(el => ({value: el.id, label: el.name}))
                              }
                            />
                        </>
                    }
                </div>
                <div className="flex mt-4 justify-center">
                    <Button className="mr-2" type="secondary" text="Отмена" onClick={() => setModalUser(user)}/>
                    <Button type="primary" text="Сохранить" submit={true}/>
                </div>
            </form>
        </MyModal>
    )
}

export default ModalTeamLead