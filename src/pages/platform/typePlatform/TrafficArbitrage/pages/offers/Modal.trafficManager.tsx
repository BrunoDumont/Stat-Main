//core
import React, {useEffect, useState} from "react";
import {useMutation} from "@apollo/client";
import clsx from "clsx";
import {useAlert} from "react-alert";
//components
import {Selector} from "@components/Base/Selector";
import {Button} from "@components/Base/Button";

//interfaces
import MyModal from "@components/Modal/Modal";
import {currencyValue, ErrorType, IModal} from "./Modal";

//request
import UpdateOffer from "@gql/Offers/updateOffer.gql";


const ModalOfferTrafficManager: React.FC<IModal> = ({show, showModal, offer, refetch, type, user}) => {
    const alert = useAlert();
    const [modalOffer, setModalOffer] = useState(offer)

    const [sourceWrap, setSourceWrap] = useState(false)
    const [campaignId, setCampaignId] = useState('')

    const [error, setError]: [ErrorType, (arg0: ErrorType) => void] = useState({
        type: '', error: ''
    })

    useEffect(() => {
        setModalOffer(offer)
    }, [offer])

    useEffect(() => {
        setError({type: '', error: ''})
    }, [show])

    const [updateOfferMutation] = useMutation(UpdateOffer);

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

    return (
        <MyModal show={show} showModal={showModal} size="max-w-5xl">
            <form onSubmit={(e) => updateOffer(e)}>
                <p className="flex border-b pb-2">
                    <span className="font-semibold text-xl ">
                        {
                            "Изменение оффера " + modalOffer.name
                        }
                    </span>
                    <span className="material-icons ml-auto my-auto cursor-pointer text-gray-600"
                          onClick={() => showModal(false)}>
                        close
                    </span>
                </p>
                <div className="mt-4 border-b pb-4">
                    {
                        Object.keys(modalOffer).length > 0 && <>
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
                                        <p>{el.newApprove ? `${el.newApprove} %` : '-'}</p>
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

                            <p className="mt-8 font-bold mb-4">Потоки</p>
                            <div className="grid grid-cols-3">
                                <p className="font-bold text-gray-500">Название потока</p>
                                <p className="font-bold text-gray-500">Айди потока</p>
                                <p className="font-bold text-gray-500">Доп. ифнормация</p>
                                {
                                    modalOffer.flows.map((el, index) => <React.Fragment key={index}>
                                        <p className="mt-3">{el.name}</p>
                                        <p className="mt-3">{el.uid}</p>
                                        <p className="mt-3">{el.comment}</p>
                                    </React.Fragment>)
                                }
                            </div>
                            <div className="grid grid-cols-2 mt-4">
                                <p className="mt-8 font-bold">Добавить id кампаний Facebook</p>
                                <p className="mt-8 font-bold">id кампаний Facebook</p>
                                <div className="flex mt-2 h-10">
                                    <input
                                        value={campaignId}
                                        placeholder='Введите id кампании'
                                        className="border rounded-l p-1 outline-none"
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
                                                    user
                                                })
                                                return {...prev, campaignId: arrWithId}
                                            })
                                            setCampaignId('')
                                        }}
                                    >
                                        <span className="material-icons p-1">add</span>
                                        <span className="my-auto">Добавить</span>
                                    </button>
                                </div>
                                <div className="mt-2">
                                    {
                                        modalOffer.campaignId
                                            ? <Selector
                                                type={"modal"}
                                                value={modalOffer.campaignId.map(el => ({value: el.uid, label: el.uid, isFixed: el.user.id !== user.id}))}
                                                onChange={(data) => {
                                                    const idArr = data.map(({value}: { value: number }) => {
                                                        return {
                                                            uid: value,
                                                            type: 'Facebook',
                                                            user
                                                        }
                                                    })
                                                    setModalOffer(prev => ({...prev, campaignId: idArr}))
                                                }}
                                                options={modalOffer.campaignId.map(el => ({value: el.uid, label: el.uid}))}
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

export default ModalOfferTrafficManager