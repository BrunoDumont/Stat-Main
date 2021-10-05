//core
import React, {Suspense, lazy} from "react";
import {Route, Switch} from "react-router-dom";

//components
import GlobalLoader from "@components/Loaders/GlobaLoader";
import Header from "@components/user.auth/PageHeader/Header";
import BodyWrapper from "@components/user.auth/PageBody/BodyWrapper";
import Alert from "@components/Base/alert/Alert";

//pages
const Home = lazy(() => import('@pages/user.auth/home/Home'));
const PageNotFound = lazy(() => import('@pages/common/ErrorPages/PageNotFound404'));
const Documentation = lazy(() => import('@pages/user.auth/Documentation/Documentation'));
const Settings = lazy(() => import("@pages/user.auth/settings/Settings"));
const Integrations = lazy(() => import("@pages/user.auth/integrations/Integrations"));
const Tariffs = lazy(() => import("@pages/user.auth/tariffs/Tariffs"));

const CreateStatistic = lazy(() => import("@pages/user.auth/createStatistic/CreateStatistic"));
const RouterNavbar: React.FC = () => {
  return (
    <div className="pt-12 md:pl-12">
      <Header/>
      <Alert/>
      <BodyWrapper>
        <Suspense fallback={GlobalLoader}>
          <Switch>
            {/*работа со статистиками*/}
            <Route path="/" exact={true} component={Home}/>
            <Route path="/createStatistic/" exact={true} component={CreateStatistic}/>
            {/*Интеграции*/}
            <Route path="/tariffs/" exact component={Tariffs}/>
            {/*Интеграции*/}
            <Route path="/integrations/" exact component={Integrations}/>
            {/*Настройки*/}
            <Route path="/settings/" exact component={Settings}/>
            {/*Документация*/}
            <Route path="/documentation/" exact component={Documentation}/>
            <Route component={PageNotFound}/>
          </Switch>
        </Suspense>
      </BodyWrapper>
    </div>
  )
}
export default RouterNavbar