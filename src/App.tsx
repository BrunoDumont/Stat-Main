//core
import React, {useEffect} from "react";
import {positions, Provider} from "react-alert";
import clsx from "clsx";

//components
import GlobalLoader from "@components/Loaders/GlobaLoader";
import RouterNavbar from "@components/Routers/RouterNavbar";
import RouterNavbarNoAuth from "@components/Routers/RouterNavbarNoAuth";

//request
import workWithServer from "@core/workWithServer";

//redux
import {useAppDispatch, useAppSelector} from "@/store/hooks";
import {setCurrentUser} from "@/store/features/userSlice";

const App: React.FC = () => {
  const user = useAppSelector((state) => state.user.currentUser)
  const dispatch = useAppDispatch()

  useEffect(() => {
      workWithServer.currentUser()
        .then((data: IUser) => {
          dispatch(setCurrentUser({...data, isLoading: false}))
        })
        .catch(() => {
          dispatch(setCurrentUser({...user, isLoading: false}))
        })
    }, []
  );

  if (user.isLoading) return <GlobalLoader/>;

  return <>
    {
      user.email
        ? <RouterNavbar/>
        : <RouterNavbarNoAuth/>
    }
  </>
}

export default App;
