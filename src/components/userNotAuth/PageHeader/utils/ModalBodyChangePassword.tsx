import React, {useState} from "react";
import {Input} from "@components/Base/Input";
import {Button} from "@components/Base/Button";


type TProps = {
    showModal: () => void,
    email: string,
    code: string
}

function ModalBodyForChangePassword({showModal, email, code}: TProps): JSX.Element {
    const [password, setPassword] = useState('');
    const [validPassword, setValidPassword] = useState(true);

    const sendPassword = () => {
        const passwordRegex = new RegExp("^(?=.*[A-Z])(?=.*[0-9])")
        const validPassword = password.length >= 8 && passwordRegex.test(password)
        setValidPassword(validPassword)
        if (validPassword) {
            // workWithServer.setNewPassword({
            //   email: email,
            //   code: code,
            //   password: password
            // }).then((data) => {
            //   initUser(data)
            //   showModal(false)
            // }).catch(() => {
            //   setValidPassword(false)
            // })
        }
    }

    return (
        <div className="mx-2">
            <p className="font-semibold text-xl md:text-2xl text-center my-2">
                Восстановление доступа
            </p>
            <p className="text-center my-2">
                Введите новый пароль
            </p>
            <Input
                className="mx-0 my-2"
                placeholder="Введите новый пароль"
                value={password}
                setValue={(data) => {
                    setPassword(data)
                    setValidPassword(true)
                }}
            />
            {
                !validPassword &&
                <p className="text-xs text-red-400 pl-2 mt-1"><i className="material-icons mr-2 text-base align-top">
                    warning
                </i>Пароль должен состоять из не менее 8 латинских символов, 1 заглавной буквы, и 1 цифры</p>
            }
            <Button
                className="mx-0 w-full"
                type="primary"
                text="Применить"
                onClick={() => {
                    sendPassword()
                }}
            />
        </div>
    )
}

export default ModalBodyForChangePassword