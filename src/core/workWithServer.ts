import {serverURI} from "@/config/serverURI";

const server = serverURI

const workWithServer = {
  //work with user
  currentUser: () => {
    return requestGet(`${server}/user/currentUser/`)
  },
  login: (data: IUser) => {
    return requestPost(`${server}/user/login/`, data)
  },
  signup: (data: IUser) => {
    return requestPost(`${server}/user/signup/`, data)
  },
  changeUserDate: (data: FormData) => {
    return requestPostFormData(`${server}/user/changeUserData/`, data)
  },
  getUserAvatar: (imageName: string) => {
    return `${server}/user/avatar/${imageName}`
  },
  // work with integration app
  getAllApp: () => {
    return requestGet(`${server}/integration-app/getAllApps/`)
  },
  // work with integration user
  getIntegrationUsers: () => {
    return requestGet(`${server}/integration-user/getIntegrationUsers/`)
  },
  loginFB: (data: {token: string}) => {
    return requestPost(`${server}/integration-user/loginFB/`, data)
  },
  // work with integration cabinet
  getIntegrationCabinetsFromFB: (data: {account_id: number}) => {
    return requestPost(`${server}/integration-cabinet/getIntegrationCabinetsFromFB/`, data)
  },
  saveIntegrationCabinetsFromFB: (data: {account_id: number, cabinets: IIntegrationCabinet[]}) => {
    return requestPost(`${server}/integration-cabinet/saveIntegrationCabinetsFromFB/`, data)
  },

  getCampaignsName: () => {
    return requestGet(`${server}/integration-cabinet/getCampaignsName/`)
  },
}
export default workWithServer

function status(response: Response) {
  if (response.status >= 200 && response.status < 300) {
    return Promise.resolve(response.json())
  } else {
    return Promise.reject(response.text())
  }
}

async function request(url: string, body: object) {
  return await fetch(url, body).then(status)
}

async function requestGet(url: string) {
  const headers: any = {
    'Accept': 'application/json, text/plain, */*',
    "Content-type": "application/x-www-form-urlencoded; charset=UTF-8",
    'X-Requested-With': 'XMLHttpRequest',
  };
  let token = getCookie('token');
  token && (headers['Authorization'] = `Bearer ${token}`);
  return await request(url, {
    // credentials: 'include',
    method: 'GET',
    headers: headers,
  })
}

async function requestPost(url: string, data: object) {
  const headers: any = {
    'Accept': 'application/json, text/plain, */*',
    "Content-type": "application/json; charset=UTF-8",
    'X-Requested-With': 'XMLHttpRequest',
  };
  let token = getCookie('token');
  token && (headers['Authorization'] = `Bearer ${token}`);
  return await request(url, {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(data)
  })
}

async function requestPostFormData(url: string, data: object) {
  const headers: any = {
  };
  let token = getCookie('token');
  token && (headers['Authorization'] = `Bearer ${token}`);
  return await request(url, {
    method: 'POST',
    headers: headers,
    body: data
  })
}

function getCookie(name: string) {
  let matches = document.cookie.match(new RegExp(
    "(?:^|; )" + name.replace(/([.$?*|{}()[]\/+^])/g, '\\$1') + "=([^;]*)"
  ));
  return matches ? decodeURIComponent(matches[1]) : undefined
}

// const setCookie = (name, value, props = {'Path': '/', maxAge: 1800}) => {
//   let exp = props.expires;
//   if (typeof exp == "number" && exp) {
//     let d = new Date();
//     d.setTime(d.getTime() + exp * 1000)
//     exp = props.expires = d
//   }
//   if (exp && exp.toUTCString) {
//     props.expires = exp.toUTCString()
//   }
//
//   value = encodeURIComponent(value)
//   let updatedCookie = name + "=" + value
//
//   for (let propName in props) {
//     updatedCookie += "; " + propName
//     let propValue = props[propName]
//     if (propValue !== true) {
//       updatedCookie += "=" + propValue
//     }
//   }
//
//   document.cookie = updatedCookie
// }
