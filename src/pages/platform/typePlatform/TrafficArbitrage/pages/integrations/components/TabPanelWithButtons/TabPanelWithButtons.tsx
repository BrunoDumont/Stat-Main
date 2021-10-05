//core
import React from "react";

//components
import FacebookButtons from "./Facebook";
import KmaBizButtons from "./KmaBiz";
import OfferrumButtons from "./Offerum";
import M1ShopButtons from "./M1Shop";
import ProfitPayButtons from "./ProfitPay";

export interface ITabPanelWithButtons {
    app: IIntegrationApp
    selectedRows: any[]
}

const TabPanelWithButtons: React.FC<ITabPanelWithButtons> = ({app,  selectedRows}) => {
    switch (app.name) {
        case 'Facebook':
            return <FacebookButtons app={app} selectedRows={selectedRows}/>
        case 'KMA.BIZ':
            return <KmaBizButtons app={app} selectedRows={selectedRows}/>
        case 'Offerrum':
            return <OfferrumButtons app={app} selectedRows={selectedRows}/>
        case 'M1-SHOP':
            return <M1ShopButtons app={app} selectedRows={selectedRows}/>
        case 'ProfitPay':
            return <ProfitPayButtons app={app} selectedRows={selectedRows}/>
        default:
            return <div className="py-4"/>
    }
}

export default TabPanelWithButtons