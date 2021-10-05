//core
import React from "react";
import {Route, Switch} from "react-router-dom";

//pages
import LandingPage from "@pages/user.not.auth/LandingPage";
import UserAgreement from "@pages/user.not.auth/UserAgreement/UserAgreement";
import PrivacyPolicy from "@pages/PrivacyPolicy";
import PageNotFound from "@pages/common/ErrorPages/PageNotFound404";

const RouterNavbarNoAuth: React.FC = () => {
  return (
    <Switch>
      <Route path="/" exact component={LandingPage}/>
      {/*пользовательское соглашение*/}
      <Route path="/userAgreement/" exact component={UserAgreement}/>
      {/*политика конфиденциальности*/}
      <Route path="/privacyPolicy/" exact component={PrivacyPolicy}/>
      {/*/!*Страница не найдена*!/*/}
      <Route component={PageNotFound}/>
    </Switch>
  )
}

export default RouterNavbarNoAuth