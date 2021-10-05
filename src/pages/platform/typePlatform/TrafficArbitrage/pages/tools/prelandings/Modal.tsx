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

const ModalPrelanding: React.FC<IModal> = ({show, showModal, landing, refetch, type}) => {
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
    addLandingMutation({
      variables: {
        addLandingData: modalLanding
      }
    }).then(() => {
      refetch()
      showModal(false)
    })
  }

  const updateLanding = (e: React.FormEvent) => {
    e.preventDefault();
    const {landingsByFlow, ...data} = modalLanding;
    updateLandingMutation({
      variables: {
        updateLandingData: data
      }
    }).then(() => refetch())
    showModal(false)
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
                  ? "Создание прелендинга"
                  : "Изменение прелендинга " + modalLanding.name
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
          <p className="text-left mt-4">Ссылка на прелендинг</p>
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

export default ModalPrelanding