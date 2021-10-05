//core
import React, {useMemo} from "react";

//components
import Header from "@pages/platform/components/header/Header";

//static data
import header_navigation from "@pages/platform/typePlatform/AgencyLidgen/static_data/header_navigation";

//pages
import PageNotFound from "@pages/common/ErrorPages/PageNotFound404";

//types
import {PageType} from "@pages/platform/Platform";


const AgencyLidgen: React.FC<PageType> = ({pathToPlatform, activePage, platform, user}) => {

  let active_page_jsx = <PageNotFound/>

  const navigation = useMemo(() => {
      const nav = header_navigation(pathToPlatform, activePage, user).filter(el => el.has_user_access)
      nav.forEach(el => {
        if (el.child) {
          el.child.forEach(child => {
              if (child.active) active_page_jsx = child.component
            }
          )
        } else if (el.active) active_page_jsx = el.component
      })
      return nav
    }, [pathToPlatform, activePage, user]
  )

  return (
    <div>
      <Header navList={navigation} platformName={platform.platformName}/>
      <div className="bg-gray-100 fixed w-full h-full left-0 top-0 pt-16 z-0 p-6 md:pl-20 overflow-y-auto">
        {active_page_jsx}
      </div>
    </div>
  )
}

export default AgencyLidgen