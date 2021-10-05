//core
import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {useLazyQuery, useMutation, useQuery} from "@apollo/client";
import clsx from "clsx";

//components
import {Selector} from "@components/Base/Selector";
import {Button} from "@components/Base/Button";
import GlobalLoader from "@components/Loaders/GlobaLoader";

//interfaces
import MyModal, {IModalProps} from "@components/Modal/Modal";
import {URL_PARAMS} from "@pages/platform/Platform";

//request
import GetListIntegrationApps from "@gql/Integration/getListIntegrationApps.gql";
import GetListIntegrationAccounts from "@gql/Integration/getListIntegrationAccounts.gql";
import GetListExternalOffers from "@gql/Offers/getListExternalOffers.gql";
import GetListWorker from "@gql/ControlPerson/getListWorker.gql";
import AddOffer from "@gql/Offers/addOffer.gql";
import UpdateOffer from "@gql/Offers/updateOffer.gql";
import {useAlert} from "react-alert";


export interface IModal extends IModalProps {
  offer: IOffer
  refetch: () => void
  type: string
  user: IUser
}

export type ErrorType = {
  error: string
  type: string
}

export type CurrenceValueType = {
  [key: string]: string
}

export const currencyValue: CurrenceValueType = {
  'RUB': '₽'
}

const ModalOffer: React.FC<IModal> = ({show, showModal, offer, refetch, type, user}) => {
  let params: URL_PARAMS = useParams();
  const alert = useAlert();

  const [modalOffer, setModalOffer] = useState(offer)

  const initApp: IIntegrationApp = {}
  const [selectedApp, setSelectedApp] = useState(initApp)
  const initAccount: IIntegrationAccount = {}
  const [selectedAccount, setSelectedAccount] = useState(initAccount)

  const [sourceWrap, setSourceWrap] = useState(false)
  const [campaignId, setCampaignId] = useState('')
  const init_flow: IOfferFlow = {
    name: '',
    uid: '',
    comment: ''
  }
  const [flow, setFlow] = useState(init_flow)

  const [error, setError]: [ErrorType, (arg0: ErrorType) => void] = useState({
    type: '', error: ''
  })

  const [getExternalOffers, externalOffers] = useLazyQuery(GetListExternalOffers, {
    fetchPolicy: "network-only",
  })

  useEffect(() => {
    setModalOffer(offer)
  }, [offer])

  useEffect(() => {
    setError({type: '', error: ''})
  }, [show])

  useEffect(() => {
    if (!selectedAccount.id) return;
    getExternalOffers({
      variables: {
        account_id: selectedAccount.id
      }
    })
  }, [selectedAccount])

  const [addOfferMutation] = useMutation(AddOffer);
  const [updateOfferMutation] = useMutation(UpdateOffer);

  const addOffer = (e: React.FormEvent) => {
    e.preventDefault()
    const data = {
      ...modalOffer,
      platform: {
        platformName: params.platformId
      },
      app: {
        id: selectedApp.id
      }
    }

    addOfferMutation({
      variables: {
        addOfferData: data
      }
    }).then(() => {
      alert.success('Оффер добавлен')
      refetch()
    })
    showModal(false)
  }

  const updateOffer = (e: React.FormEvent) => {
    e.preventDefault()
    updateOfferMutation({
      variables: {
        updateOfferData: modalOffer
      }
    }).then(() => {
      alert.success('Оффер изменен')
      refetch()
    })
    showModal(false)
  }

  let appSelector: IIntegrationApp[] = []
  let accountSelector: IIntegrationAccount[] = []
  let offerSelector: IOffer[] = []
  let userSelector: IUser[] = []

  //get list IntegrationsApps
  let arrWithIntegrationApps = useQuery(GetListIntegrationApps, {
    variables: {
      platformName: params.platformId,
    }
  });

  //get list IntegrationsAccounts
  let arrWithIntegrationAccounts = useQuery(GetListIntegrationAccounts, {
    variables: {
      platformName: params.platformId
    }
  });

  // get list traffic manager
  let arrWithUser = useQuery(GetListWorker, {
    variables: {
      platformName: params.platformId,
      pagination: {pageIndex: 0, pageSize: 1000, sortBy: {"id": "username", desc: true}}
    }
  });
  if (arrWithUser.data && arrWithUser.data.getListWorker) {
    if (user.group === 'CLIENT_TEAM_LEAD') {
      const temp: IUser = arrWithUser.data.getListWorker.users.find((el: IUser) => el.id === user.id)
      userSelector &&= temp.children.filter((el: IUser) => el.offerByUser.length === 0)
    } else {
      userSelector = arrWithUser.data.getListWorker.users
        .map((el: IUser) => {
          if (el.children.length > 0) return el.children
          return el
        })
        .filter((el: any) => el.length > 0 || el.group === 'CLIENT_TRAFFIC_MANAGER')
        .flat(1)
        .filter((el: IUser) => el.offerByUser.length === 0)
    }

  }

  if (arrWithIntegrationAccounts.loading || arrWithIntegrationApps.loading) return <GlobalLoader/>

  if (arrWithIntegrationApps.data) {
    appSelector = arrWithIntegrationApps.data.getListIntegrationApps
  }

  if (arrWithIntegrationAccounts.data) {
    accountSelector = arrWithIntegrationAccounts.data.getListIntegrationAccounts
  }

  if (externalOffers.data) {
    offerSelector = externalOffers.data.getListExternalOffers
  }

  return (
    <MyModal show={show} showModal={showModal} size="max-w-5xl">
      <form onSubmit={(e) => type === 'add' ? addOffer(e) : updateOffer(e)}>
        <p className="flex border-b pb-2">
                    <span className="font-semibold text-xl ">
                        {
                          type === 'add'
                            ? "Создание оффера"
                            : "Изменение оффера " + modalOffer.name
                        }
                    </span>
          <span className="material-icons ml-auto my-auto cursor-pointer text-gray-600"
                onClick={() => showModal(false)}>
                        close
                    </span>
        </p>
        <div className="mt-4 border-b pb-4">
          {
            type === 'add' && <>
                <p className="text-left">Выберите партнерку</p>
                <Selector
                    type="modal"
                    value={{value: selectedApp.id, label: selectedApp.name}}
                    onChange={({value}) => {
                      const app = appSelector.find((app) => app.id === value)
                      setSelectedApp(app)
                      setSelectedAccount(initAccount)
                      setModalOffer({})
                    }}
                    options={
                      appSelector
                        .filter((app) => app.category === 'PARTNER')
                        .map((app) => ({value: app.id, label: app.name}))
                    }
                />

                <p className="text-left mt-2">Выберите пользователя</p>
                <Selector
                    type="modal"
                    value={{value: selectedAccount.id, label: selectedAccount.name}}
                    onChange={({value}) => {
                      const account = accountSelector.find((account) => account.id === value)
                      setSelectedAccount(account)
                      setModalOffer({})
                    }}
                    options={
                      accountSelector
                        .filter(account => account.app.id === selectedApp.id)
                        .map((account) => ({value: account.id, label: account.name}))
                    }
                />

                <p className="text-left mt-2">Выберите оффер</p>
                <Selector
                    type="modal"
                    isLoading={externalOffers.loading}
                    value={{value: modalOffer.name, label: modalOffer.name}}
                    onChange={({value}) => {
                      const offer = offerSelector.find(offer => offer.name === value)
                      setModalOffer(offer)
                    }}
                    options={offerSelector
                      .map((offer) => ({value: offer.name, label: offer.name}))
                    }
                />
            </>
          }

          {
            Object.keys(modalOffer).length > 1 && <>
                <p className="text-left mt-4">Статус</p>
                <Selector
                    type="modal"
                    value={{value: modalOffer.status, label: (modalOffer.status ? 'Активный' : 'Неактивный')}}
                    onChange={({value}) => setModalOffer({...modalOffer, status: Boolean(value)})}
                    options={[true, false].map(status => {
                      return {value: status, label: (status ? 'Активный' : 'Неактивный')}
                    })}
                />
                <div className="grid grid-cols-7 py-4 mt-4">
                    <p className="font-bold">Страна</p>
                    <p className="font-bold">Цена</p>
                    <p className="font-bold"><span className="material-icons">laptop_mac</span></p>
                    <p className="font-bold"><span className="material-icons">phone_iphone</span></p>
                    <p className="font-bold">Аппрув</p>
                    <p className="font-bold">Новый аппрув</p>
                    <p className="font-bold">Целевое действие</p>
                </div>

                <div className="divide-y">
                  {
                    modalOffer.payments && modalOffer.payments.map((el, index) => <div key={index}
                                                                                       className="grid grid-cols-7 py-4">
                      <p>{el.name}</p>
                      <p>{el.price}{currencyValue.hasOwnProperty(el.currency) ? currencyValue[el.currency] : el.currency}</p>
                      <p>{el.paymentDesktop}{currencyValue.hasOwnProperty(el.currency) ? currencyValue[el.currency] : el.currency}</p>
                      <p>{el.paymentMobile}{currencyValue.hasOwnProperty(el.currency) ? currencyValue[el.currency] : el.currency}</p>
                      <p>{el.approve}%</p>
                      <p><input
                        className="border rounded w-12 p-1"
                        value={el.newApprove || ''}
                        onChange={e => {
                          const value = Number(e.target.value);
                          if (!isNaN(value) && value <= 100) {
                            setModalOffer(prev => {
                              const payment = {...el, newApprove: value}
                              const payments = [...prev.payments];
                              payments[index] = payment;
                              return {...prev, payments}
                            })
                          }
                        }}
                      /></p>
                      <p>{el.targetAction}</p>
                    </div>)
                  }
                </div>

                <p className="mt-4 font-bold">Источники трафика</p>
                <div className="flex flex-row flex-wrap">
                  {
                    modalOffer.sources && modalOffer.sources.length > 0
                      ? <> {[...modalOffer.sources]
                        .sort(el => !el.allow ? 1 : -1)
                        .map((el, idx) => {
                          if (!sourceWrap && idx > 7) return
                          return <p key={el.name}
                                    className={clsx('mr-1 flex p-2', {'text-gray-400': !el.allow})}>
                                                <span
                                                  className="material-icons mr-1">{el.allow ? 'done' : 'close'}</span>
                            <span className="my-auto">{el.name}</span>
                          </p>
                        })}
                        {
                          modalOffer.sources.length > 7 && <p
                              className="text-gray-500 underline ml-2 p-2 cursor-pointer"
                              onClick={() => setSourceWrap(prev => !prev)}
                          >{sourceWrap ? 'Свернуть ...' : 'Развернуть ...'}</p>
                        }
                      </>
                      : <p>Источники отсутствуют</p>
                  }
                </div>

                <p className="mt-8 font-bold mb-4">Добавление потока</p>
                <div className="grid grid-cols-4">
                    <p className="font-bold text-gray-500">Название потока</p>
                    <p className="font-bold text-gray-500">Айди потока</p>
                    <p className="font-bold text-gray-500">Доп. ифнормация</p>
                    <p/>
                    <input
                        className="border rounded mr-4 mt-2 p-1"
                        value={flow.name}
                        onChange={(e) => {
                          setFlow(prev => ({...prev, name: e.target.value}))
                        }}
                    />
                    <input
                        className="border rounded mr-4 mt-2 p-1"
                        value={flow.uid}
                        onChange={(e) => {
                          setFlow(prev => ({...prev, uid: e.target.value}))
                        }}
                    />
                    <input
                        className="border rounded mr-4 mt-2 p-1"
                        value={flow.comment}
                        onChange={(e) => {
                          setFlow(prev => ({...prev, comment: e.target.value}))
                        }}
                    />
                    <button
                        className="border rounded p-1 border-green-500 text-green-500  mt-2"
                        onClick={() => {
                          setModalOffer(prev => {
                            const flows = [...prev.flows, flow]
                            return {...prev, flows}
                          })
                          setFlow(init_flow)
                        }}
                        type="button"
                    >
                        Сохранить поток
                    </button>
                  {
                    modalOffer.flows && modalOffer.flows.map((el, index) => <React.Fragment key={index}>
                      <p className="mt-3">{el.name}</p>
                      <p className="mt-3">{el.uid}</p>
                      <p className="mt-3">{el.comment}</p>
                      <p className="flex mt-3 text-gray-500 cursor-pointer" onClick={() => {
                        setModalOffer(prev => {
                          let flows = [...prev.flows];
                          flows.splice(index, 1);
                          return {...prev, flows}
                        })
                      }}>
                        <span className="material-icons">delete</span>
                        <span className="my-auto">Удалить поток</span>
                      </p>
                    </React.Fragment>)
                  }
                </div>
                <p className="mt-8 mb-2 font-bold">Добавление трафик-менеджера</p>
                <Selector
                    type="modal"
                    isMulti={true}
                    value={
                      modalOffer.offerByUser
                        ? modalOffer.offerByUser.map(el => ({
                          value: el.user.id,
                          label: el.user.username
                        }))
                        : []
                    }
                    onChange={(data) => {
                      const childrenUserArr = data.map(({value}: { value: number }) => {
                        const user = userSelector.find(el => el.id === value) || modalOffer.offerByUser.find(el => el.user.id === value).user
                        return {user}
                      })
                      setModalOffer({...modalOffer, offerByUser: childrenUserArr})
                    }}
                    options={userSelector.map((el) => ({value: el.id, label: el.username}))
                    }
                />

                <div className="grid grid-cols-2 mt-4">
                    <p className="mt-8 font-bold">Добавить id кампаний Facebook</p>
                    <p className="mt-8 font-bold">id кампаний Facebook</p>
                    <div className="flex mt-2 h-10 pr-4">
                        <input
                            value={campaignId}
                            placeholder='Введите id кампании'
                            className="border rounded-l p-1 outline-none w-full"
                            onChange={(e) => {
                              setCampaignId(e.target.value)
                            }}
                        />
                        <button
                            className="flex text-green-500 border rounded-r border-green-500 p-1"
                            type="button"
                            onClick={() => {
                              if (!campaignId) return
                              setModalOffer(prev => {
                                const arrWithId = prev.campaignId ? [...prev.campaignId] : []
                                arrWithId.push({
                                  uid: campaignId,
                                  type: 'Facebook',
                                  user: user
                                })
                                return {...prev, campaignId: arrWithId}
                              })
                              setCampaignId('')
                            }}
                        >
                            <span className="material-icons p-1">add</span>
                            <span className="my-auto p-1">Добавить</span>
                        </button>
                    </div>
                    <div className="mt-2">
                      {
                        modalOffer.campaignId
                          ? <Selector
                            type={"modal"}
                            value={modalOffer.campaignId.map(el => ({
                              value: el.uid,
                              label: el.uid,
                            }))}
                            onChange={(data) => {
                              const idArr = data.map(({value}: { value: number }) => {
                                return {
                                  uid: value,
                                  type: 'Facebook',
                                  user
                                }
                              })
                              setModalOffer(prev => {
                                const idArr = data.map(({value}: { value: string }) => {
                                  const old = prev.campaignId.find(id => id.uid === value)
                                  return {
                                    uid: value,
                                    type: 'Facebook',
                                    user,
                                    ...old
                                  }
                                })
                                return {...prev, campaignId: idArr}
                              })
                            }}
                            options={modalOffer.campaignId.filter(el => el.user.id === user.id).map(el => ({
                              value: el.uid,
                              label: el.uid
                            }))}
                            isMulti={true}
                          />
                          : <p>Здесь будут id кампаний</p>
                      }
                    </div>
                </div>

                <textarea
                    className="w-full p-1 mt-8 border rounded"
                    placeholder="Укажите дополнительную информацию"
                    value={modalOffer.comment}
                    onChange={(e) => {
                      setModalOffer(prev => {
                        return {...prev, comment: e.target.value}
                      })
                    }}/>
            </>
          }

          {
            error.type === 'offer' &&
            <span className="text-red-500 text-sm">{error.error}</span>
          }
        </div>
        <div className="flex mt-4 justify-center">
          <Button className="mr-2" type="secondary" text="Отмена"
                  onClick={() => setModalOffer(offer)}/>
          <Button type="primary" text="Сохранить" submit={true}/>
        </div>
      </form>
    </MyModal>
  )
}

export default ModalOffer