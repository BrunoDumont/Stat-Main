//core
import React from "react";

//components
import FacebookButtons from "./Facebook";

export interface ITabPanelWithButtons {
    app: IIntegrationApp
}

const TabPanelWithButtons: React.FC<ITabPanelWithButtons> = ({app}) => {
    switch (app.name) {
        case 'Facebook':
            return <FacebookButtons app={app}/>
        // case 'VK':
        //     return <KmaBizButtons app={app} selectedRows={selectedRows}/>
        default:
            return <div className="py-4"/>
    }
}

export default TabPanelWithButtons