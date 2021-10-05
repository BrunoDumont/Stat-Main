import React, {useState} from "react";
import {Input} from "@components/Base/Input";
import {Button} from "@components/Base/Button";


type ModalBodyForForgottenPasswordType = {
    setModalBody: (element: JSX.Element) => void,
    showModal: () => void
}

const ModalBodyForForgottenPassword: React.FC<ModalBodyForForgottenPasswordType> = ({setModalBody, showModal}) => {

    const [email, setEmail] = useState('');
    const [validEmail, setValidEmail] = useState(true);

    const restorePassword = (e: MouseEvent) => {
        e.preventDefault()
        const validEmail = email && email.includes('@') && email.includes('.')
        setValidEmail(validEmail)
        if (validEmail) {
            // workWithServer.restorePassword({
            //   "email": email,
            // }).then((data) => {
            //   setModalBody(<ModalBodyForCode email={email} showModal={showModal} initUser={initUser} code={data['code']} setModalBody={setModalBody}/>)
            // }).catch(() => setValidEmail(false))
        }
    }

    return (
        <div className="mx-2">
            <p className="font-semibold text-xl md:text-2xl text-center my-2">
                Восстановление доступа
            </p>
            <p className="text-center my-2">
                Введите эл. почту на которую зарегистрирован ваш аккаунт
            </p>
            <Input className="mx-0 my-2" placeholder="Введите эл. почту" value={email} setValue={setEmail}/>
            {!validEmail &&
            <p className="text-xs text-red-400 pl-2 mt-1"><i className="material-icons mr-2 text-base align-top">
                warning
            </i>Некорректная почта</p>}
            <Button className="mx-0 w-full" type="primary" text="Продолжить" onClick={restorePassword}/>
        </div>
    )
}

export default ModalBodyForForgottenPassword