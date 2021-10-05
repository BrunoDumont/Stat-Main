//core
import React, {useState} from "react";
import {useParams} from "react-router-dom";
import {useMutation} from "@apollo/client";
import Cookies from "js-cookie";

//components
import {Input} from "@components/Base/Input";
import {Button} from "@components/Base/Button";

//types
import {URL_PARAMS} from "@pages/platform/Platform";

//requests
import LoginUser from "@gql/loginUser.gql";
import User from "@gql/user.gql";


const AuthPlatform: React.FC = () => {
    let params: URL_PARAMS = useParams();

    const [loginMutation] = useMutation(LoginUser, {
        update(cache, {data: {login}}) {
            login && Cookies.set('token', login.token)
            cache.writeQuery({
                query: User,
                data: {
                    getCurrentUser: login
                }
            });
        }
    });

    const [user, setUser] = useState({
        email: '',
        password: '',
        platformName: params.platformId
    })

    const [error, setError] = useState('')

    const login = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        loginMutation({
            variables: {
                loginData: user
            }
        })
        .catch(e => setError(e.message))
    }

    return <div className="flex h-screen">
        <div className="m-auto shadow p-10 bg-white">
            <p className="text-2xl sm:text-4xl mb-4 text-center underline ">{params.platformId}</p>
            <form className="pt-4" onSubmit={login}>
                <p>Эл. почта</p>
                <Input
                    value={user.email}
                    className="sm:w-64"
                    placeholder="Введите email..."
                    setValue={value => setUser(prevState => ({...prevState, email: value}))}
                />
                <p>Пароль</p>
                <Input
                    className="bg-white"
                    type="password"
                    value={user.password}
                    placeholder="Введите пароль..."
                    setValue={value => setUser(prevState => ({...prevState, password: value}))}
                />
                { error && <p className="text-center text-red-500">{error}</p>}
                <div className="px-2">
                    <Button type="primary" submit={true} text="Войти" className="w-full mt-4" />
                </div>
            </form>
        </div>
    </div>
}

export default AuthPlatform