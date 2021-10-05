//core
import React, {useEffect, useState} from "react";
import {useMutation, useQuery} from "@apollo/client";
import {useAlert} from "react-alert";

//components
import {Button} from "@components/Base/Button";
import ModalForAddFBCabinet from "../Modal/ModalForAddFBCabinet";

//interfaces
import {ITabPanelWithButtons} from "./TabPanelWithButtons";

//requests
import LoginFB from "@gql/Integration/loginFB.gql";
import GetListIntegrationAccounts from "@gql/Integration/getListIntegrationAccounts.gql";
import DeleteListIntegrationCabinets from '@gql/Integration/deleteListIntegrationCabinets.gql'
import DeleteListIntegrationAccounts from '@gql/Integration/deleteListIntegrationAccounts.gql'
import {URL_PARAMS} from "@pages/platform/Platform";
import {useParams} from "react-router-dom";

function setFbAsyncInit(appId: string, version: string) {
    // @ts-ignore
    window.fbAsyncInit = () => {
        // @ts-ignore
        window.FB.init({
            version: `v${version}`,
            appId,
            cookie: true,
            xfbml: true,
        });
        // @ts-ignore
        FB.AppEvents.logPageView();
    };

    ((d, s, id) => {
        const element = d.getElementsByTagName(s)[0];
        const fjs = element;
        let js = element;
        if (d.getElementById(id)) { return; }
        js = d.createElement(s); js.id = id;
        // @ts-ignore
        js.src = `https://connect.facebook.net/en_US/sdk.js`;
        fjs.parentNode.insertBefore(js, fjs);
    })(document, 'script', 'facebook-jssdk');
}

function FB_login(loginFB: any) {
    // @ts-ignore
    FB.login(function (response: any) {
        if (response.status === 'connected') {
            let token_fb = response['authResponse'].accessToken;
            loginFB({
                variables: {
                    token: token_fb
                }
            })
        }
    }, {scope: 'ads_management,ads_read,leads_retrieval,pages_manage_ads,pages_read_engagement'});
}

const FacebookButtons: React.FC<ITabPanelWithButtons> = ({app, selectedRows}) => {
    const alert = useAlert();
    let params: URL_PARAMS = useParams();
    //get list IntegrationsAccounts
    let arrWithIntegrationAccounts = useQuery(GetListIntegrationAccounts, {
        variables: {
            platformName: params.platformId
        }
    });

    const [loginFBMutation] = useMutation(LoginFB, {
        update(cache, {data: {loginFB}}) {
            const old_data: { getListIntegrationAccounts: IIntegrationAccount[] }  = cache.readQuery({
                query: GetListIntegrationAccounts,
                variables: {
                    platformName: params.platformId
                }
            });
            cache.writeQuery({
                query: GetListIntegrationAccounts,
                variables: {
                    platformName: params.platformId
                },
                data: {
                    getListIntegrationAccounts: [...old_data.getListIntegrationAccounts, loginFB]
                }
            });
        }
    });

    const [deleteAccountsMutation] = useMutation(DeleteListIntegrationAccounts);
    const [deleteCabinetsMutation] = useMutation(DeleteListIntegrationCabinets);

    const [showModalForAddCabinet, setShowModalForAddCabinet] = useState(false)

    useEffect(() => {
        if(app) setFbAsyncInit(app.uid, app.version)
    }, [app])

    return <div className="flex py-4">
        <Button
            type="primary"
            text="Аккаунт"
            icon="add"
            className="mr-2"
            onClick={() => FB_login(loginFBMutation)}
        />
        <Button
            type="primary"
            text="Кабинет"
            icon="view_list"
            className="mr-2"
            onClick={() => setShowModalForAddCabinet(true)}
        />
        <Button
            type="secondary"
            text="Удалить"
            icon="close"
            onClick={() => {
                const delete_accounts: IIntegrationAccount[] = selectedRows
                    .filter(el => el.original.hasOwnProperty('token'))
                    .map(el => {
                        const {__typename, ...data } = el.original
                        return data
                    })
                const delete_cabinets_id: number[] = selectedRows
                    .filter(el => el.original.hasOwnProperty('factor'))
                    .filter(el => !delete_accounts.find(account => account.cabinets.find((cabinet) => cabinet.name === el.original.name)))
                    .map(el => el.original.id)
                const delete_accounts_id: number[] = delete_accounts.map(el => el.id)

                deleteAccountsMutation({
                    variables: {
                        accounts_id: delete_accounts_id
                    }
                }).then(data => {
                    alert.success('Аккаунты успешно удалены')
                    arrWithIntegrationAccounts.refetch()
                })

                deleteCabinetsMutation({
                    variables: {
                        cabinets_id: delete_cabinets_id
                    }
                }).then(data => {
                    alert.success('Кабинеты успешно удалены')
                    arrWithIntegrationAccounts.refetch()
                })
            }}
        />
        <ModalForAddFBCabinet
            show={showModalForAddCabinet}
            setShow={setShowModalForAddCabinet}
        />
    </div>
}

export default FacebookButtons