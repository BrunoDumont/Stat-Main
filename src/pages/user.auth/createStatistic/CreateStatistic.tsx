// core
import React, {useEffect, useState} from "react";
import {useHistory} from "react-router-dom";

//components
import {Button} from "@components/Base/Button";
import {ImageUploader, Input} from "@components/Base/Input";
import Row from "@components/Base/Row";
import workWithServer from "@core/workWithServer";

export default function CreateStatistic() {
  let history = useHistory();

  const initStatistic: Statistic = {
    name: '',
  }
  const [addStatistic, setAddStatistic] = useState(initStatistic)
  const [image, setImage] = useState(initStatistic.avatar)
  const [campaigns, setCampaigns] = useState([])

  useEffect(() => {
    workWithServer.getCampaignsName().then((data: Campaign[]) => {
      setCampaigns(data)
    })
  }, [])

  const facebookCampaigns = campaigns.filter(el => el.type === 'Facebook')
  return (
    <>
      <div className="flex">
        <i
          className="material-icons mr-2 my-auto cursor-pointer"
          onClick={() => {
            history.push('/')
          }}
        >arrow_back</i>
        <span className="font-bold text-xl my-auto mr-2">Создание статистики</span>
      </div>

      <div className="rounded shadow-sm bg-white mt-4 p-4">
        <Row label="Название статистики">
          <Input
            value={addStatistic.name}
            placeholder="Введите название"
            setValue={(name) => setAddStatistic((prev: Statistic) => ({
              ...prev,
              name
            }))}
          />
        </Row>
        <Row label="Описание статистики">
          <Input
            value={addStatistic.description}
            placeholder="Введите описание"
            setValue={(description) => setAddStatistic((prev: Statistic) => ({
              ...prev,
              description
            }))}
          />
        </Row>
        <Row label="Обложка">
          <ImageUploader image={image} setImage={setImage} circle={false}/>
        </Row>
        <Row label="Метки">
          <Input
            value={addStatistic.tags}
            placeholder="Укажите метки через запятую, не более 5 штук"
            setValue={(tags) => setAddStatistic((prev: Statistic) => ({
              ...prev,
              tags
            }))}
          />
        </Row>
      </div>
      <div className="rounded shadow-sm bg-white mt-4 p-4">
        {facebookCampaigns.toString()}
      </div>
      <div className="rounded shadow-sm bg-white mt-4 p-4">
        1
      </div>

      <Button type="primary" text="Создать статистику" icon="add" className="mx-auto mt-4 w-full md:w-auto"/>
    </>
  )
}