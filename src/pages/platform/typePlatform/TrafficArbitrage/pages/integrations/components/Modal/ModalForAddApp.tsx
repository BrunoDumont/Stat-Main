//core
import React, {useState} from "react";
import clsx from "clsx";

//components
import {Input} from "@components/Base/Input";
import {Selector} from "@components/Base/Selector";
import {Button} from "@components/Base/Button";
import MyModal from "@components/Modal/Modal";

//images
import Facebook from "@public/images/integrations/Facebook.svg";
import VK from "@public/images/integrations/VK.svg";
import KMABIZ from "@public/images/integrations/kmaBiz.svg";
import Offerrum from "@public/images/integrations/Offerrum.png";
import ProfitPay from "@public/images/integrations/ProfitPay.png"
import M1Shop from "@public/images/integrations/M1-SHOP.jpeg";

const arrWithImages: { [key: string]: string } = {
  'Facebook': Facebook,
  'VK': VK,
  'KMA.BIZ': KMABIZ,
  'Offerrum': Offerrum,
  'M1-SHOP': M1Shop,
  'ProfitPay': ProfitPay,
}

export const AppCategories = {
  '': 'Все категории',
  'SOURCE_TRAFFIC': 'Источники траффика',
  'PARTNER': 'Партнерка'
}

interface IModalForAddApp {
  show: boolean;
  setShow: (arg0: boolean) => void,
  allIntegrationApps: IIntegrationApp[],
  appsWithIntegration: IIntegrationApp[],
  setAppsWithIntegration: (arg0: (prev: IIntegrationApp[]) => IIntegrationApp[]) => void
}

const ModalForAddApp: React.FC<IModalForAddApp> = ({
                                                     show,
                                                     setShow,
                                                     allIntegrationApps,
                                                     appsWithIntegration,
                                                     setAppsWithIntegration
                                                   }) => {
  const [filterByServiceName, setFilterByServiceName] = useState('')
  const initFilterByServiceCategory: keyof typeof AppCategories = ''
  const [filterByServiceCategory, setFilterByServiceCategory] = useState(initFilterByServiceCategory)
  const [selectedAppName, setSelectedAppName] = useState('')

  return <MyModal show={show} showModal={setShow}>
    <p className="flex border-b pb-2">
      <span className="font-semibold text-xl">Новая интеграция</span>
      <span className="material-icons ml-auto my-auto cursor-pointer text-gray-600"
            onClick={() => setShow(false)}>
                        close
                    </span>
    </p>
    <p className="my-4 text-center">
      Введите название сервиса или воспользуйтесь фильтром по категориям
    </p>
    <div>
      <Input
        value={filterByServiceName}
        placeholder="Название сервиса ..."
        setValue={setFilterByServiceName}
        className="mx-0"
      />
      <Selector
        type="primary"
        value={{value: filterByServiceCategory, label: AppCategories[filterByServiceCategory]}}
        onChange={({value}) => setFilterByServiceCategory(value)}
        options={
          Object.keys(AppCategories)
            .map((key: keyof typeof AppCategories) => ({value: key, label: AppCategories[key]}))
        }
      />

      <div className="my-4 flex flex-wrap" style={{minHeight: 200}}>
        {
          allIntegrationApps
            .filter((el) => el.name.indexOf(filterByServiceName) >= 0)
            .filter((el) => el.category.indexOf(filterByServiceCategory) >= 0)
            .filter((el) => !appsWithIntegration.find(app => app.name === el.name))
            .map((el) => {
              return <div
                key={el.id}
                className={clsx("h-20 p-2 flex flex-col",
                  {"border rounded border-gold": el.name === selectedAppName})}
                onClick={() => setSelectedAppName(el.name)}
              >
                {
                  arrWithImages[el.name] &&
                  <img
                      className="rounded-md mx-auto"
                      height={50}
                      width={50}
                      src={arrWithImages[el.name]}
                      alt={`logo ${el.name}`}
                  />
                }
                <span className="mx-auto mt-auto">{el.name}</span>
              </div>
            })
        }
      </div>
      <Button
        type="primary"
        text="Добавить"
        className="w-full mt-4"
        disabled={!selectedAppName}
        onClick={() => {
          setAppsWithIntegration(prev => [...prev, allIntegrationApps.find((el) => el.name === selectedAppName)])
          setShow(false)
          setSelectedAppName('')
        }}
      />
    </div>
  </MyModal>
}

export default ModalForAddApp