//core
import React from 'react'
import {useQuery} from "@apollo/client";
import {Link, useParams} from "react-router-dom";

//components
import GlobalLoader from "@components/Loaders/GlobaLoader";
import Header from "@components/user.auth/PageHeader/Header";
import AuthPlatform from "@pages/platform/auth/AuthPlatform";

//requests
import User from "@gql/user.gql";

//platforms
import AgencyLidgen from "@pages/platform/typePlatform/AgencyLidgen/AgencyLidgen";
import TrafficArbitrage from "@pages/platform/typePlatform/TrafficArbitrage/TrafficArbitrage";


export interface URL_PARAMS {
  platformId?: string | undefined,
  page?: string | undefined
  param1?: string | undefined
}

export interface IPage {
  pathToPlatform: string
  activePage: string
  platform: IPlatform
  user: IUser
}

const Platform: React.FC = () => {
  let params: URL_PARAMS = useParams();

  const idPlatform = params.platformId
  const activePage = params.page

  const {loading, error, data} = useQuery(User);

  if (loading) return <GlobalLoader/>

  if(error) return <AuthPlatform/>

  const user: IUser = data.getCurrentUser

  if (!idPlatform) {
    const root_dir_jsx = user.platforms && <div>{user.platforms.map(single_platform => {
      return <Link key={single_platform.id} to={'/platforms/' + single_platform.platformName}>
        <p className="m-2">
          Войти на платформу с id {single_platform.id} и названием {single_platform.platformName}
        </p>
      </Link>
      })}
    </div>

    return (
      <div>
        <Header/>
        {root_dir_jsx}
      </div>
    )
  }

  const platform = user.platforms.find(platform => platform.platformName === idPlatform) || user.platform
  if (!platform)  return <AuthPlatform/>

  if (platform.type === 'AgencyLidgen') {
    return <AgencyLidgen
      platform={platform}
      pathToPlatform={'/platforms/' + platform.platformName}
      activePage={activePage}
      user={user}
    />
  }

  if (platform.type === 'TrafficArbitrage') {
    return <TrafficArbitrage
      platform={platform}
      pathToPlatform={'/platforms/' + platform.platformName}
      activePage={activePage}
      user={user}
    />
  }

  return  <div>Платформы не существует</div>
}

export default Platform