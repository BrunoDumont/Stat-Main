//core
import React, {useState} from "react";
import Cookies from "js-cookie";

//request
import workWithServer from "@core/workWithServer";

//redux
import {useAppDispatch} from "@/store/hooks";
import {setCurrentUser} from "@/store/features/userSlice";
import {data} from "autoprefixer";

export default function useLogin() {
  const [email, setEmail] = useState('');
  const initError: Message = null
  const [errorEmail, setErrorEmail] = useState(initError);
  const [password, setPassword] = useState('');
  const [validPassword, setValidPassword] = useState(true);

  const dispatch = useAppDispatch()
  const login = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const validEmail = email && email.includes('@') && email.includes('.')
    setErrorEmail(validEmail ? null : { message: 'Некорректная почта', type: 'error'})
    const validPassword = !!password

    setValidPassword(validPassword)

    if (validEmail && validPassword) {
      workWithServer.login({
        email,
        password
      })
        .then(r => {
          if( r.type === 'error'){
            setErrorEmail(r)
          }else{
            const {token, ...data} = r
            dispatch(setCurrentUser(data))
            Cookies.set('token', token)
          }
        })
        .catch(async (err) => {
          setErrorEmail({
            type: 'error',
            message: 'Отсутствует интернет соединение'
          })

        })
    }
  }

  return {
    email, setEmail, errorEmail, setErrorEmail,
    password, setPassword,
    validPassword, setValidPassword,
    login
  }
}