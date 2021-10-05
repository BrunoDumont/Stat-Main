//core
import React, {useState} from "react";
import Cookies from "js-cookie";

//request
import workWithServer from "@core/workWithServer";

//redux
import {setCurrentUser} from "@/store/features/userSlice";
import {useAppDispatch} from "@/store/hooks";


export default function useSignUp() {

  const [name, setName] = useState('');
  const [validName, setValidName] = useState(true);

  const [email, setEmail] = useState('');
  const [validEmail, setValidEmail] = useState(true);

  const [password, setPassword] = useState('');
  const [validPassword, setValidPassword] = useState(true);

  const [password2, setPassword2] = useState('');
  const [validPassword2, setValidPassword2] = useState(true);

  const [agreement, setAgreement] = useState(true);
  const dispatch = useAppDispatch()

  const signUp = (e: React.FormEvent) => {
    e.preventDefault()
    const validName = !!name
    const validEmail = email && email.includes('@') && email.includes('.')
    const passwordRegex = new RegExp("^(?=.*[A-Z])(?=.*[0-9])")
    const validPassword = password.length >= 8 && passwordRegex.test(password)
    const validPassword2 = password === password2
    setValidName(validName)
    setValidEmail(validEmail)
    setValidPassword(validPassword)
    setValidPassword2(validPassword2)

    if (validEmail && validPassword && agreement) {
      workWithServer.signup({
        email,
        password,
        username: name,
      })
        .then(r => {
          const { token, ...data} = r
          dispatch(setCurrentUser(data))
          Cookies.set('token', token)
        })
        .catch(e => {
        })
    }
  }

  return {
    name, setName,
    validName, setValidName,
    email, setEmail,
    validEmail, setValidEmail,
    password, setPassword,
    validPassword, setValidPassword,
    password2, setPassword2,
    validPassword2, setValidPassword2,
    agreement, setAgreement,
    signUp
  }
}