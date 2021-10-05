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
import AddFlow from "@gql/tools/flows/addFlow.gql";
import UpdateFlow from "@gql/tools/flows/updateFlow.gql";
import GetFlowData from "@gql/tools/flows/getFlowsDataForModal.gql";
import clsx from "clsx";
import {ToggleCheckBox} from "@components/Base/CheckBox";

interface IModal extends IModalProps {
  flow: IFlow
  refetch: () => void
  type: string
}

type ErrorType = {
  error: string
  type: string
}

const test_data = (flow: IFlow) => {
  if (flow.name.length < 1) return {
    'type': 'name',
    'error': 'Введите название'
  }
  if (!flow.app) return {
    'type': 'domain',
    'error': 'Укажите источник трафика'
  }
  const prelandings = flow.landingsByFlow.filter(el => !el.landing.isLanding).filter(el => el.useInFlow)
  const percent_prelandings = prelandings.reduce((acc, val) => acc + val.percent,0)
  if(prelandings.length > 0 && percent_prelandings !== 100) return {
    'type': 'prelandings',
    'error': 'Сумма процентов должна быть равной 100'
  }
  const landings = flow.landingsByFlow.filter(el => el.landing.isLanding).filter(el => el.useInFlow)
  const percent_landings = landings.reduce((acc, val) => acc + val.percent,0)
  if(landings.length > 0 && percent_landings !== 100) return {
    'type': 'landings',
    'error': 'Сумма процентов должна быть равной 100'
  }

  if(!flow.redirect){
    if(prelandings.length > 1) return {
      'type': 'prelandings',
      'error': 'В потоке без редиректа возможно использовать только 1 прелендинг'
    }
    if(prelandings.length === 0 && landings.length > 1) return {
      'type': 'landings',
      'error': 'В потоке без редиректа и прелендингов возможно использовать только 1 лендинг'
    }
  }
  return true
}

const ModalFlow: React.FC<IModal> = ({show, showModal, flow, refetch, type}) => {
  let params: URL_PARAMS = useParams();

  const [modalFlow, setModalFlow] = useState(flow)

  const [error, setError]: [ErrorType, (arg0: ErrorType) => void] = useState({
    type: '', error: ''
  })

  useEffect(() => {
    setModalFlow(flow)
  }, [flow])

  useEffect(() => {
    setError({type: '', error: ''})
  }, [show])

  let flowData = useQuery(GetFlowData, {
    variables: {
      platformName: params.platformId
    }
  });

  const [addFlowMutation] = useMutation(AddFlow);
  const [updateFlowMutation] = useMutation(UpdateFlow);

  const addFlow = (e: React.FormEvent) => {
    e.preventDefault()
    const test = test_data(modalFlow);
    if (test === true) {
      addFlowMutation({
        variables: {
          addFlowData: modalFlow
        }
      }).then(() => refetch())
      showModal(false)
    } else {
      setError(test)
    }
  }

  const updateFlow = (e: React.FormEvent) => {
    e.preventDefault()
    const test = test_data(modalFlow);
    if (test === true) {
      updateFlowMutation({
        variables: {
          updateFlowData: modalFlow
        }
      }).then(() => refetch())
      showModal(false)
    } else {
      setError(test)
    }
  }

  let domainSelector: IFlowDomain[] = []
  let appSelector: IIntegrationApp[] = []
  let landingSelector: ILanding[] = []

  if (flowData.data) {
    domainSelector = flowData.data.getListFlowDomains
    appSelector = flowData.data.getListIntegrationApps
    landingSelector = flowData.data.getLandings
  }

  const prelandings = modalFlow.landingsByFlow.filter(el => !el.landing.isLanding)
  const landings = modalFlow.landingsByFlow.filter(el => el.landing.isLanding)
  return (
    <MyModal show={show} showModal={showModal} size="max-w-5xl">
      <form onSubmit={(e) => type === 'add' ? addFlow(e) : updateFlow(e)}>
        <p className="flex border-b pb-2">
                    <span className="font-semibold text-xl ">
                        {
                          type === 'add'
                            ? "Создание потока"
                            : "Изменение потока " + modalFlow.name
                        }
                    </span>
          <span
            className="material-icons ml-auto my-auto cursor-pointer text-gray-600"
            onClick={() => showModal(false)}
          >close</span>
        </p>
        <div className="mt-4 border-b pb-4">
          <p className="text-left mt-4">Название</p>
          <Input
            className="mx-0 my-2"
            placeholder="Введите название ..."
            value={modalFlow.name}
            setValue={(data) => {
              setModalFlow({...modalFlow, name: data})
              setError({type: '', error: ''})
            }}
          />
          {
            error.type === 'name' && <span className="text-red-500 text-sm">{error.error}</span>
          }

          <p className="text-left mt-4">Редирект</p>
          <Selector
            type="modal"
            value={{
              value: modalFlow.redirect,
              label: modalFlow.redirect ? 'Да' : 'Нет'
            }}
            onChange={(data) => {
              setModalFlow({
                ...modalFlow,
                redirect: data.value,
                domain: null,
                landingsByFlow: modalFlow.landingsByFlow.filter((el) => !el.landing.isLanding)
              })
            }}
            options={[{value: true, label: 'Да'}, {value: false, label: 'Нет'}]}
          />

          {
            modalFlow.redirect && <>
                <p className="text-left mt-4">Домен потока</p>
                <Selector
                    type="modal"
                    value={{
                      value: modalFlow.domain ? modalFlow.domain.id : '',
                      label: modalFlow.domain ? modalFlow.domain.name : ''
                    }}
                    onChange={(data) => {
                      setError({type: '', error: ''})
                      const domain = domainSelector.find(el => el.id === data.value)
                      setModalFlow({...modalFlow, domain})
                    }}
                    options={domainSelector.map(el => ({value: el.id, label: el.name}))}
                />
            </>
          }
          <p className="text-left mt-4">Источник трафика</p>
          <Selector
            type="modal"
            value={{
              value: modalFlow.app ? modalFlow.app.id : '',
              label: modalFlow.app ? modalFlow.app.name : ''
            }}
            onChange={(data) => {
              setError({type: '', error: ''})
              const app = appSelector.find(el => el.id === data.value)
              setModalFlow({...modalFlow, app})
            }}
            options={appSelector.filter(el => el.category === 'SOURCE_TRAFFIC').map(el => ({
              value: el.id,
              label: el.name
            }))}
          />
          {
            error.type === 'domain' && <span className="text-red-500 text-sm">{error.error}</span>
          }
          <p className="text-left mt-4">Прелендинги</p>
          <Selector
            type="modal"
            isMulti={true}
            value={modalFlow.landingsByFlow
              .filter((el) => !el.landing.isLanding)
              .map((el) => ({value: el.landing.id, label: el.landing.name}))}
            onChange={(data) => {
              setError({type: '', error: ''})
              const prelandingsByFlow = data.map(({value}: { value: number }, index: number) => {
                const landing = landingSelector.find(el => el.id === value)
                let landByFlow = modalFlow.landingsByFlow.find(el => el.landing && el.landing.id === value)
                if(data.length === 1){
                  landByFlow = {}
                }
                return {
                  landing,
                  useInFlow: index === 0,
                  percent: index === 0 ? 100 : 0,
                  ...landByFlow
                }
              })
              const landingsByFlow = modalFlow.landingsByFlow.filter(el => el.landing.isLanding)
              setModalFlow({...modalFlow, landingsByFlow: [...prelandingsByFlow, ...landingsByFlow]})
            }}
            options={landingSelector
              .filter(el => !el.isLanding)
              .filter(el => {
                if (modalFlow.landingsByFlow.length > 0) {
                  return modalFlow.landingsByFlow[0].landing.offer.id === el.offer.id
                }
                return true
              })
              .map(el => ({value: el.id, label: el.name}))}
          />
          {
            prelandings.length > 1 && <LandingList
                landingsByFlow={prelandings}
                modalFlow={modalFlow}
                setModalFlow={setModalFlow}
                landings={landings}
                prelandings={prelandings}
            />
          }
          {
            error.type === 'prelandings' && <span className="text-red-500 text-sm">{error.error}</span>
          }
          <p className="text-left mt-4">Лендинги</p>
          <Selector
            type="modal"
            isMulti={true}
            value={modalFlow.landingsByFlow
              .filter((el) => el.landing.isLanding)
              .map((el) => ({value: el.landing.id, label: el.landing.name}))}
            onChange={(data) => {
              setError({type: '', error: ''})
              const landingsByFlow = data.map(({value}: { value: number }, index: number) => {
                const landing = landingSelector.find(el => el.id === value)
                let landByFlow = modalFlow.landingsByFlow.find(el => el.landing && el.landing.id === value)
                if(data.length === 1){
                  landByFlow = {}
                }

                return {
                  landing,
                  useInFlow: index === 0,
                  percent: index === 0 ? 100 : 0,
                  ...landByFlow
                }
              })
              const prelandingsByFlow = modalFlow.landingsByFlow.filter(el => !el.landing.isLanding)
              setModalFlow({...modalFlow, landingsByFlow: [...prelandingsByFlow, ...landingsByFlow]})
            }}
            options={landingSelector
              .filter(el => el.isLanding)
              .filter(el => el.redirect === modalFlow.redirect)
              .filter(el => {
                if (modalFlow.landingsByFlow.length > 0) {
                  return modalFlow.landingsByFlow[0].landing.offer.id === el.offer.id
                }
                return true
              })
              .map(el => ({value: el.id, label: el.name}))}
          />
          {
            landings.length > 1 && <LandingList
                landingsByFlow={landings}
                modalFlow={modalFlow}
                setModalFlow={setModalFlow}
                landings={landings}
                prelandings={prelandings}
            />
          }
          {
            error.type === 'landings' && <span className="text-red-500 text-sm">{error.error}</span>
          }

        </div>
        <div className="flex mt-4 justify-center">
          <Button className="mr-2" type="primary" text="Сохранить" submit={true}/>
          <Button  type="secondary" text="Отмена"
                  onClick={() => setModalFlow(flow)}/>

        </div>
      </form>
    </MyModal>
  )
}

export default ModalFlow

interface ILandingList {
  landingsByFlow: ILandingsByFlow[]
  modalFlow: IFlow
  setModalFlow: (arg0: IFlow) => void
  landings: ILandingsByFlow[]
  prelandings: ILandingsByFlow[]
}

const LandingList: React.FC<ILandingList> = ({
                                               landingsByFlow,
                                               modalFlow,
                                               setModalFlow,
                                             }) => {
  return <>{
    landingsByFlow.map((el, index) => {
      return <div key={index} className={clsx("relative flex my-2 bg-gray-100", {
        'bg-opacity-25': !el.useInFlow
      })}>
        <div className={clsx("absolute h-full w-0.5 bg-gold z-10", {
          'bg-opacity-25': !el.useInFlow
        })}/>
        <div className="flex p-2 w-full">
                  <span className={clsx('text-black', {
                    'text-opacity-25': !el.useInFlow
                  })}>{el.landing.name}</span>
          <div className="ml-auto flex divide-x divide-white">
            <div className={clsx('pr-2', {
              'text-opacity-25 text-black': !el.useInFlow
            })}>
              <input
                className="w-10 bg-transparent text-right px-1 outline-none focus:border-blue-300"
                disabled={!el.useInFlow}
                value={el.percent}
                onChange={(e) => {
                  const value = Number(e.target.value)
                  if (isNaN(value) || value < 0 || value > 100) return
                  const lByFlow = modalFlow.landingsByFlow.map((l) => {
                    return l.landing.id === el.landing.id ? {...l, percent: value} : l
                  })
                  setModalFlow({...modalFlow, landingsByFlow: lByFlow})
                }}
              /> %
            </div>
            <div className="flex px-2">
              <ToggleCheckBox
                className="my-auto"
                onChange={(e) => {
                  const landingsByFlow = modalFlow.landingsByFlow.map(l => {
                    return l.landing.id === el.landing.id ? {...l, useInFlow: e.target.checked} : l
                  })
                  setModalFlow({...modalFlow, landingsByFlow})

                }}
                checked={el.useInFlow}
              />
            </div>
            <i
              className="material-icons my-auto text-gray-400 pl-2 cursor-pointer"
              onClick={(data) => {
                const landingsByFlow = modalFlow.landingsByFlow.filter(l => l.landing.id !== el.landing.id)
                const type = el.landing.isLanding
                let typeLandings = landingsByFlow.filter(l => l.landing.isLanding === type)
                if(typeLandings.length === 1){
                  typeLandings = [{...typeLandings[0], percent: 100}]
                }
                let otherLandings = landingsByFlow.filter(l => l.landing.isLanding !== type)
                setModalFlow({...modalFlow, landingsByFlow: [...typeLandings, ...otherLandings]})
              }}
            >delete</i>
          </div>
        </div>
      </div>
    })
  }</>
}