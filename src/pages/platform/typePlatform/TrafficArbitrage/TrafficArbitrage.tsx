//core
import React, {Suspense, useMemo} from "react";

//components
import Header from "@pages/platform/components/header/Header";

//static data
import header_navigation from "@pages/platform/typePlatform/TrafficArbitrage/static_data/header_navigation";

//pages
import PageNotFound from "@pages/common/ErrorPages/PageNotFound404";

//types
import {IPage} from "@pages/platform/Platform";


const TrafficArbitrage: React.FC<IPage> = ({pathToPlatform, activePage, platform, user}) => {

  let active_page_jsx = <PageNotFound/>

  const navigation = header_navigation(pathToPlatform, activePage, user).filter(el => el.has_user_access)
  navigation.forEach(el => {
    if (el.child) {
      el.child.forEach(child => {
          if (child.active) active_page_jsx = child.component
        }
      )
    } else if (el.active) active_page_jsx = el.component
  })

  return (
    <div>
      <Header navList={navigation} platformName={platform.platformName}/>
      <div className="bg-gray-100 fixed w-full h-full left-0 top-0 pt-16 z-0 p-6 md:pl-20 overflow-y-auto">
        {active_page_jsx}
      </div>
    </div>
  )
}

export default TrafficArbitrage