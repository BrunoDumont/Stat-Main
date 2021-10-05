//core
import React from "react"
import {Link} from "react-router-dom";

//components
import {Button} from "@components/Base/Button";

//hooks
import useSignUp from "@components/userNotAuth/PageHeader/Modal/hooks/useSignUp";


const ModalBodySignUp: React.FC = () => {
    const data = useSignUp()

    return (
        <div>
            <form className="pt-4" onSubmit={data.signUp}>
                <div className="mb-2">
                    <label className="block mb-1" htmlFor="name">Ваше имя</label>
                    <input
                        className="appearance-none border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:border-gold"
                        id="name"
                        type="text"
                        placeholder="Введите имя"
                        value={data.name}
                        onChange={(e) => {
                            data.setName(e.target.value);
                            data.setValidName(true)
                        }}
                    />
                    {
                        !data.validName && <p className="text-xs text-red-400 pl-2 mt-1">
                            <i className="material-icons mr-2 text-base align-top"> warning</i>Неверное имя
                        </p>
                    }
                </div>
                <div className="mb-2">
                    <label className="block mb-1" htmlFor="email">Эл. почта</label>
                    <input
                        className="appearance-none border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:border-gold"
                        id="email"
                        type="text"
                        placeholder="Введите эл. почту"
                        value={data.email}
                        onChange={(e) => {
                            data.setEmail(e.target.value);
                            data.setValidEmail(true)
                        }}
                    />
                    {
                        !data.validEmail &&
                        <p className="text-xs text-red-400 pl-2 mt-1">
                            <i className="material-icons mr-2 text-base align-top">warning</i>
                            Некорректная почта или уже зарегистрирована
                        </p>
                    }
                </div>
                <div className="mb-2">
                    <label className="block mb-1" htmlFor="password">Пароль</label>
                    <input
                        className="appearance-none border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:border-gold"
                        id="password"
                        type="password"
                        placeholder="Введите пароль"
                        onChange={(e) => {
                            data.setPassword(e.target.value);
                            data.setValidPassword(true)
                        }}
                    />
                    {
                        !data.validPassword &&
                        <p className="text-xs text-red-400 pl-2 mt-1">
                            <i className="material-icons mr-2 text-base align-top">warning</i>
                            Пароль должен состоять из не менее 8 латинских символов, 1 заглавной буквы, и 1 цифры
                        </p>
                    }
                </div>
                <div className="mb-2">
                    <label className="block mb-1" htmlFor="password2">Подтвердите пароль</label>
                    <input
                        className="appearance-none border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:border-gold"
                        id="password2"
                        type="password"
                        placeholder="Введите пароль"
                        onChange={(e) => {
                            data.setPassword2(e.target.value);
                            data.setValidPassword2(true)
                        }}
                    />
                    {
                        !data.validPassword2 &&
                        <p className="text-xs text-red-400 pl-2 mt-1">
                            <i className="material-icons mr-2 text-base align-top">warning</i>
                            Пароли не совпадают
                        </p>
                    }
                </div>
                <div className="my-4">
                    {/*<CheckBox isCheck={data.agreement} onClick={data.setAgreement}/>*/}
                    <span>
                        Я принимаю
                        <Link to="/userAgreement/">
                            {/*<u onClick={() => showModal(false)}>пользовательское соглашение</u>*/}
                        </Link> и
                        <Link to="/privacyPolicy/">
                            {/*<u onClick={() => showModal(false)}>политику конфедициальности</u>*/}
                        </Link>
                      </span>
                </div>
                <div className="mb-4 text-center">
                    <Button className="mx-0 w-full" text="Зарегистрироваться" type="primary" submit={true}/>
                </div>
            </form>

        </div>
    )
}

export default ModalBodySignUp
