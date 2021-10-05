//core
import React, {useState} from "react";
import {useAlert} from "react-alert";
import {useMutation, useQuery} from "@apollo/client";

//components
import {Button} from "@components/Base/Button";
import ModalForAddIntegrationAccount from "../Modal/ModalForAddIntegrationAccount";

//interfaces
import {ITabPanelWithButtons} from "@pages/platform/typePlatform/TrafficArbitrage/pages/integrations/components/TabPanelWithButtons/TabPanelWithButtons";

//requests
import DeleteListIntegrationAccounts from "@gql/Integration/deleteListIntegrationAccounts.gql";
import GetListIntegrationAccounts from "@gql/Integration/getListIntegrationAccounts.gql";
import {URL_PARAMS} from "@pages/platform/Platform";
import {useParams} from "react-router-dom";

const M1ShopButtons: React.FC<ITabPanelWithButtons> = ({app, selectedRows}) => {
    const alert = useAlert();
    let params: URL_PARAMS = useParams();

    const [showModalForAddAccount, setShowModalForAddAccount] = useState(false)

    //get list IntegrationsAccounts
    let arrWithIntegrationAccounts = useQuery(GetListIntegrationAccounts, {
        variables: {
            platformName: params.platformId
        }
    });
    const [deleteAccountsMutation] = useMutation(DeleteListIntegrationAccounts);

    return <div className="flex py-4">
        <Button
            type="primary"
            text="Аккаунт"
            icon="add"
            className="mr-2"
            onClick={() => setShowModalForAddAccount(true)}
        />
        <Button
            type="secondary"
            text="Удалить"
            icon="close"
            onClick={() => {
                const delete_accounts_id: number[] = selectedRows
                    .filter(el => el.original.hasOwnProperty('token'))
                    .map(el => el.original.id)

                deleteAccountsMutation({
                    variables: {
                        accounts_id: delete_accounts_id
                    }
                }).then(data => {
                    alert.success('Аккаунты успешно удалены')
                    arrWithIntegrationAccounts.refetch()
                })
            }}
        />
        <ModalForAddIntegrationAccount
            show={showModalForAddAccount}
            setShow={setShowModalForAddAccount}
            app={app}
            setUID={true}
        />
    </div>
}

export default M1ShopButtons