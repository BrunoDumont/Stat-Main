import React, {useEffect} from "react";
import {Button} from "@components/Base/Button";
import clsx from "clsx";
import {useHistory} from "react-router-dom";
import {useAppDispatch, useAppSelector} from "@/store/hooks";
import workWithServer from "@core/workWithServer";
import {setIntegrationUsers} from "@/store/features/integrationAppSlice";

interface IBlockAdd {
  title: string,
  text: string,
  textButton: string,
  onClick: () => void,
  complete: boolean
}

const BlockAdd: React.FC<IBlockAdd> = ({title, text, complete, textButton, onClick}) => {
  return <div className="mb-4 bg-white rounded-xl p-4 px-8 border border-gold border-dashed w-full md:w-auto md:mr-8">
    <p className={clsx("font-bold text-lg text-black text-center",{'text-opacity-20': complete} )}>{title}</p>
    <p className={clsx("text-black text-center",{'text-opacity-20': complete} )}>{text}</p>
    {
      complete
        ? <p className="text-center">
          <i className="text-gold text-7xl  material-icons mx-auto">check</i>
      </p>
        : <Button type="primary" text={textButton} className="mt-8 mx-auto px-6" onClick={onClick}/>
    }

  </div>
}


const GroupOfBlockAdd: React.FC = () => {

  let history = useHistory();
  const integrationUsers = useAppSelector((state => state.app.allIntegrationUsers))
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (integrationUsers.length === 0) {
      workWithServer.getIntegrationUsers().then((data) => {
        dispatch(setIntegrationUsers(data))
      })
    }
  }, [])
  return <div className="md:flex mt-8">
    <BlockAdd
      title="Шаг 1"
      text="Добавить источник трафика"
      textButton="Перейти"
      onClick={() => {history.push("/integrations")}}
      complete={integrationUsers.length > 0}
    />
    <BlockAdd
      title="Шаг 2"
      text="Создать первую статистику"
      textButton="Создать"
      onClick={() => {history.push('/createStatistic')}}
      complete={false}
    />
  </div>
}
export default GroupOfBlockAdd