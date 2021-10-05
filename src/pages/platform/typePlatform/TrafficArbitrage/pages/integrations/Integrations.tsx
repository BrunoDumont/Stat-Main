//core
import React, {useEffect, useState} from "react";
import {useQuery} from "@apollo/client";
import {useParams} from "react-router-dom";

//components
import {Button} from "@components/Base/Button";


//requests
import GetListIntegrationApps from "@gql/Integration/getListIntegrationApps.gql";
import GetListIntegrationAccounts from "@gql/Integration/getListIntegrationAccounts.gql";
import {URL_PARAMS} from "@pages/platform/Platform";

//styles
import './integration.scss'

import GlobalLoader from "@components/Loaders/GlobaLoader";
import TabPanelWithContent from "./components/TabPanelWithContent/TabPanelWIthContent";
import ModalForAddApp from './components/Modal/ModalForAddApp';


const Integrations: React.FC = () => {
    let params: URL_PARAMS = useParams();

    const [showModalNewIntegration, setShowModalNewIntegration] = useState(false)
    const [appsWithIntegration, setAppsWithIntegration] = useState([])

    //get list IntegrationsApps
    let arrWithIntegrationApps = useQuery(GetListIntegrationApps, {
        variables: {
            platformName: params.platformId,
        }
    });

    //get list IntegrationsAccounts
    let arrWithIntegrationAccounts = useQuery(GetListIntegrationAccounts, {
        variables: {
            platformName: params.platformId
        }
    });

    useEffect(() => {
        if (!arrWithIntegrationAccounts.loading && !arrWithIntegrationApps.loading) {
            const appsName: string[] = []
            arrWithIntegrationAccounts.data.getListIntegrationAccounts.forEach((account: IIntegrationAccount) => {
                if (appsName.indexOf(account.app.name) < 0) appsName.push(account.app.name)
            })

            setAppsWithIntegration(appsName.map(name => arrWithIntegrationApps.data.getListIntegrationApps.find((app: IIntegrationApp) => app.name === name)))
        }
    }, [arrWithIntegrationAccounts.data, arrWithIntegrationApps.data])

    if (arrWithIntegrationAccounts.loading || arrWithIntegrationApps.loading) return <GlobalLoader/>

    return (
        <>
            <div className="flex">
                <span className="text-2xl my-auto font-bold">Интеграция</span>
                <Button
                    type="primary"
                    text="Новая интеграция"
                    icon="add"
                    className="ml-auto"
                    classNameText="hidden sm:block"
                    onClick={() => setShowModalNewIntegration(true)}
                />
            </div>
            <TabPanelWithContent
                arrWithIntegrationAccounts={arrWithIntegrationAccounts.data.getListIntegrationAccounts}
                appsWithIntegration={appsWithIntegration}
            />
            <ModalForAddApp
                show={showModalNewIntegration}
                setShow={setShowModalNewIntegration}
                allIntegrationApps={arrWithIntegrationApps.data.getListIntegrationApps}
                appsWithIntegration={appsWithIntegration}
                setAppsWithIntegration={setAppsWithIntegration}
            />
        </>
    )
}

export default Integrations