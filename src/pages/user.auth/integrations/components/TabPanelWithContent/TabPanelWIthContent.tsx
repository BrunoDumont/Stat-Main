//core
import React, {useEffect, useMemo} from "react";
import {Tab, TabList, TabPanel, Tabs} from "react-tabs";

//components
import TabPanelWithButtons from "../TabPanelWithButtons/TabPanelWithButtons";
import TabPanelTable from "./TabPanelTable";

//redux
import {useAppDispatch, useAppSelector} from "@/store/hooks";
import {setIntegrationUsers} from "@/store/features/integrationAppSlice";

//server
import workWithServer from "@core/workWithServer";


const TabPanelWithContent: React.FC = () => {
  const apps = useAppSelector((state => state.app.allApps))
  const integrationUsers = useAppSelector((state => state.app.allIntegrationUsers))
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (integrationUsers.length === 0) {
      workWithServer.getIntegrationUsers().then((data) => {
        dispatch(setIntegrationUsers(data))
      })
    }
  }, [])

  const init_acc: { [key: number]: IIntegrationUser[]} = {}
  const accounts_by_app: { [key: number]: IIntegrationUser[]} = useMemo(() => {
    return apps.reduce((acc, el) => {
      acc[el.id] = integrationUsers.filter((account) => account.app.id === el.id)
      return acc
    }, init_acc)
  }, [apps, integrationUsers])

  const header_jsx = apps.map((el) => <Tab key={el.id} className="inline-block p-2 cursor-pointer">{el.name}</Tab>)

  const content_jsx = apps.map((el) => {
    return <TabPanel key={el.id}>
      <TabPanelWithButtons app={el}/>
      <TabPanelTable data={accounts_by_app[el.id]}/>
    </TabPanel>
  })

  return <div className="mt-4">
    <Tabs>
      <TabList className="whitespace-nowrap react-tabs__tab-list">
        {header_jsx}
      </TabList>
      {content_jsx}
    </Tabs>
  </div>
}

export default TabPanelWithContent