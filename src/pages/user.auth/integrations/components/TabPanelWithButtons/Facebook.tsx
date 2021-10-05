//core
import React, {useEffect, useState} from "react";

//components
import {Button} from "@components/Base/Button";
import ModalForAddFBCabinet from "../Modal/ModalForAddFBCabinet";

//interfaces
import {ITabPanelWithButtons} from "./TabPanelWithButtons";
import workWithServer from "@core/workWithServer";


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

function FB_login(loginFB: (arg0: string) => void) {
    // @ts-ignore
    FB.login(function (response: any) {
        if (response.status === 'connected') {
            let token_fb = response['authResponse'].accessToken;
            loginFB(token_fb)
        }
    }, {scope: 'ads_management,ads_read,leads_retrieval,pages_manage_ads,pages_read_engagement'});
}

const FacebookButtons: React.FC<ITabPanelWithButtons> = ({app}) => {
    const [showModalForAddCabinet, setShowModalForAddCabinet] = useState(false)

    useEffect(() => {
        if(app) setFbAsyncInit(app.uid, app.version)
    }, [app])

    const addFBUser = (token: string) => {
        workWithServer.loginFB({token})
          .then((data) => {
            console.log(data)
        })
    }
    return <div className="flex py-4">
        <Button
            type="primary"
            text="Доб. аккаунт"
            icon="add"
            className="mr-2"
            onClick={() => FB_login(addFBUser)}
        />
        <Button
            type="primary"
            text="Доб. кабинет"
            icon="view_list"
            className="ml-auto md:ml-0"
            onClick={() => setShowModalForAddCabinet(true)}
        />
        <ModalForAddFBCabinet show={showModalForAddCabinet} setShow={setShowModalForAddCabinet}/>
    </div>
}

export default FacebookButtons