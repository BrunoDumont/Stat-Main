//core
import React, {useMemo, useState} from "react";
import {Tab, TabList, TabPanel, Tabs} from "react-tabs";

//components
import TabPanelWithButtons from "../TabPanelWithButtons/TabPanelWithButtons";
import TabPanelTable from "./TabPanelTable";

interface ITabPanelWithContent {
    appsWithIntegration: IIntegrationApp[],
    arrWithIntegrationAccounts: IIntegrationAccount[]
}

const TabPanelWithContent: React.FC<ITabPanelWithContent> = ({appsWithIntegration, arrWithIntegrationAccounts}) => {
    const [selectedRows, setSelectedRows] = useState([])

    const init_acc: { [key: number]: typeof arrWithIntegrationAccounts} = {}
    const accounts_by_app: { [key: number]: typeof arrWithIntegrationAccounts} = useMemo(() => {
        return appsWithIntegration.reduce((acc, el) => {
            acc[el.id] = arrWithIntegrationAccounts
                .filter((account) => account.app.name === el.name)
            return acc
        }, init_acc)
    }, [appsWithIntegration, arrWithIntegrationAccounts])

    if (appsWithIntegration.length === 0) return (
        <div className="mt-4">
            <p className='text-center'>У Вас еще не добавлено ни одной интеграции</p>
        </div>
    )

    const header_jsx = appsWithIntegration
        .map((el) => <Tab key={el.id} className="inline-block p-2 cursor-pointer">{el.name}</Tab>)

    const content_jsx = appsWithIntegration.map((el) => {
        return <TabPanel key={el.id}>
            <TabPanelWithButtons
                app={el}
                selectedRows={selectedRows}
            />
            <TabPanelTable
                data={accounts_by_app[el.id]}
                setSelectedRows={setSelectedRows}
            />
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