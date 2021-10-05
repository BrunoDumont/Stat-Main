//core
import React, {useEffect, useState} from "react";

//components
import {Button} from "@components/Base/Button";
import TabPanelWithContent from "./components/TabPanelWithContent/TabPanelWIthContent";

//styles
import './integration.scss'
import {useAppDispatch, useAppSelector} from "@/store/hooks";
import workWithServer from "@core/workWithServer";
import {setAllApps} from "@/store/features/integrationAppSlice";


const Integrations: React.FC = () => {
  const apps = useAppSelector((state => state.app.allApps))
  const dispatch = useAppDispatch();

  useEffect(() => {
    if(apps.length === 0){
      workWithServer.getAllApp().then((data) => {
        dispatch(setAllApps(data))
      })
    }
  }, [])

  const handleDelete = () => {

  }

  return (
    <>
      <div className="flex divide-x-2">
        <p className="font-bold text-xl my-auto mr-2">Интеграция</p>
        <div>
          <Button
            type="secondary"
            disabled={true}
            text="Удалить"
            icon="delete"
            className="ml-2"
            classNameText="sm:block"
            onClick={() => handleDelete}
          />
        </div>
      </div>
      <TabPanelWithContent/>
    </>
  )
}

export default Integrations