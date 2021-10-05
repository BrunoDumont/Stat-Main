//core
import React from "react";

//component
import LandingHeader from "@components/userNotAuth/PageHeader";
import PageFooter from "@components/userNotAuth/PageFooter";

const LandingPage: React.FC = () => {

    return (
        <div className="bg-white">
            <LandingHeader/>
            {/*<LandingBody*/}
            {/*    refToPossibility={refToPossibility}*/}
            {/*    refToTariff={refToTariff}*/}
            {/*    refToModules={refToModules}*/}
            {/*/>*/}
            <PageFooter/>
        </div>
    )
}

export default LandingPage
