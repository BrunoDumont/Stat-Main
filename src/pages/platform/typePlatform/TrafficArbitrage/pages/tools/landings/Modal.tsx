//core
import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {useMutation, useQuery} from "@apollo/client";

//components
import {Selector} from "@components/Base/Selector";
import {Button} from "@components/Base/Button";
import {Input} from "@components/Base/Input";

//interfaces
import MyModal, {IModalProps} from "@components/Modal/Modal";
import {URL_PARAMS} from "@pages/platform/Platform";

//request
import AddLanding from "@gql/tools/landings/addLanding.gql";
import UpdateLanding from "@gql/tools/landings/updateLanding.gql";
import GetListOffer from "@gql/Offers/getListOffers.gql";

interface IModal extends IModalProps {
  landing: ILanding
  refetch: () => void
  type: string
}

type ErrorType = {
  error: string
  type: string
}

const test_data = (landing: ILanding) => {
  if (landing.name.length < 1) return {
    'type': 'name',
    'error': 'Введите название'
  }
  if (landing.url.length < 7) return {
    'type': 'url',
    'error': 'Введите корректный адрес'
  }
  if (!landing.offer) return {
    'type': 'offer',
    'error': 'Выберите оффер'
  }
  if (!landing.flow) return {
    'type': 'flow',
    'error': 'Выберите поток'
  }
  if (!landing.payment) return {
    'type': 'payment',
    'error': 'Выберите гео'
  }
  return true
}

const ModalLanding: React.FC<IModal> = ({show, showModal, landing, refetch, type}) => {
  let params: URL_PARAMS = useParams();

  const [modalLanding, setModalLanding] = useState(landing)

  const [error, setError]: [ErrorType, (arg0: ErrorType) => void] = useState({
    type: '', error: ''
  })

  let offers = useQuery(GetListOffer, {
    variables: {
      platformName: params.platformId,
      pagination: {pageIndex: 0, pageSize: 1000, sortBy: []}
    }
  });

  useEffect(() => {
    setModalLanding(landing)
  }, [landing])

  useEffect(() => {
    setError({type: '', error: ''})
  }, [show])

  const [addLandingMutation] = useMutation(AddLanding);
  const [updateLandingMutation] = useMutation(UpdateLanding);

  const addLanding = (e: React.FormEvent) => {
    e.preventDefault()
    const test = test_data(modalLanding);
    if (test === true) {
      addLandingMutation({
        variables: {
          addLandingData: modalLanding
        }
      }).then(() => refetch())
      showModal(false)
    } else {
      setError(test)
    }
  }

  const updateLanding = (e: React.FormEvent) => {
    e.preventDefault()
    const test = test_data(modalLanding);
    if (test === true) {
      const {landingsByFlow, ...data} = modalLanding
      updateLandingMutation({
        variables: {
          updateLandingData: data
        }
      }).then(() => refetch())
      showModal(false)
    } else {
      setError(test)
    }
  }

  let offerSelector: IOffer[] = []

  if (offers.data) {
    offerSelector = offers.data.getListOffers.offers
  }

  return (
    <MyModal show={show} showModal={showModal} size="max-w-5xl">
      <form onSubmit={(e) => type === 'add' ? addLanding(e) : updateLanding(e)}>
        <p className="flex border-b pb-2">
                    <span className="font-semibold text-xl ">
                        {
                          type === 'add'
                            ? "Создание лендинга"
                            : "Изменение лендинга " + modalLanding.name
                        }
                    </span>
          <span className="material-icons ml-auto my-auto cursor-pointer text-gray-600"
                onClick={() => showModal(false)}>
                        close
                    </span>
        </p>
        <div className="mt-4 border-b pb-4">
          <p className="text-left mt-4">Название</p>
          <Input
            className="mx-0 my-2"
            placeholder="Введите название ..."
            value={modalLanding.name}
            setValue={(data) => {
              setModalLanding({...modalLanding, name: data})
              setError({type: '', error: ''})
            }}
          />
          {
            error.type === 'name' && <span className="text-red-500 text-sm">{error.error}</span>
          }
          <p className="text-left mt-4">Ссылка на лендинг</p>
          <Input
            className="mx-0 my-2"
            placeholder="Введите ссылку ..."
            value={modalLanding.url}
            setValue={(data) => {
              setModalLanding({...modalLanding, url: data})
              setError({type: '', error: ''})
            }}
          />
          {
            error.type === 'url' && <span className="text-red-500 text-sm">{error.error}</span>
          }
          <p className="text-left mt-4">Оффер</p>
          <Selector
            type="modal"
            value={{
              value: modalLanding.offer ? modalLanding.offer.id : '',
              label: modalLanding.offer ? modalLanding.offer.name : ''
            }}
            onChange={(data) => {
              const offer = offerSelector.find(el => el.id === data.value)
              setModalLanding({...modalLanding, offer, flow: null, payment: null})
            }}
            isLoading={offers.loading}
            options={offerSelector
              .map((el) => ({value: el.id, label: el.name}))
            }
          />
          {
            error.type === 'offer' && <span className="text-red-500 text-sm">{error.error}</span>
          }
          <p className="text-left mt-4">Поток</p>
          <Selector
            type="modal"
            value={{
              value: modalLanding.flow ? modalLanding.flow.id : '',
              label: modalLanding.flow ? modalLanding.flow.uid + (modalLanding.flow.name ? ` (${modalLanding.flow.name})` : '') : ''
            }}
            onChange={(data) => {
              const flow = modalLanding.offer.flows.find(el => el.id === data.value)
              setModalLanding({...modalLanding, flow})
            }}
            options={modalLanding.offer
              ? modalLanding.offer.flows.map((el) => ({
                value: el.id,
                label: el.uid + (el.name ? ` (${el.name})` : '')
              }))
              : []
            }
          />
          {
            error.type === 'flow' && <span className="text-red-500 text-sm">{error.error}</span>
          }
          <p className="text-left mt-4">Гео</p>
          <Selector
            type="modal"
            value={{
              value: modalLanding.payment ? modalLanding.payment.id : '',
              label: modalLanding.payment ? modalLanding.payment.name + ' ' + ` ${modalLanding.payment.paymentDesktop}` : ''
            }}
            onChange={(data) => {
              const payment = modalLanding.offer.payments.find(el => el.id === data.value)
              setModalLanding({...modalLanding, payment})
            }}
            options={modalLanding.offer
              ? modalLanding.offer.payments.map((el) => ({
                value: el.id,
                label: el.name + ` (${el.paymentDesktop})`
              }))
              : []
            }
          />
          {
            error.type === 'payment' && <span className="text-red-500 text-sm">{error.error}</span>
          }
          <p className="text-left mt-4">Редирект</p>
          <Selector
            type="modal"
            value={{
              value: modalLanding.redirect,
              label: modalLanding.redirect ? 'Да' : 'Нет'
            }}
            onChange={(data) => {
              setModalLanding({...modalLanding, redirect: data.value})
            }}
            options={[{value: true, label: 'Да'}, {value: false, label: 'Нет'}]}
          />
        </div>
        <div className="flex mt-4 justify-center">
          <Button className="mr-2" type="primary" text="Сохранить" submit={true}/>
          <Button className="mr-2" type="secondary" text="Отмена"
                  onClick={() => setModalLanding(landing)}/>
        </div>
      </form>
    </MyModal>
  )
}

export default ModalLanding