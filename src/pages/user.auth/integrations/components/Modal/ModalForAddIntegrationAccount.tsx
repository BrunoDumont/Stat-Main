//core
import React, {useState} from "react";
import {useParams} from "react-router-dom";
import clsx from "clsx";

//components
import {Button} from "@components/Base/Button";
import MyModal from "@components/Modal/Modal";
import {Input} from "@components/Base/Input";


interface IModalForAddApp {
  show: boolean;
  setShow: (arg0: boolean) => void,
  app: IIntegrationApp,
  setUID?: boolean
}

const ModalForAddIntegrationAccount: React.FC<IModalForAddApp> = ({show, setShow, app, setUID = false}) => {
  const initAccount = {
    platformName: params.platformId,
    uid: '',
    name: '',
    token: '',
    error_text: '',
    error_type: '',
    app_id: app.id,
  }

  const [loginUserData, setLoginUserData] = useState(initAccount)

  //addAccount
  const [addAccountMutation] = useMutation(AddAccount, {
    update(cache, {data: {addIntegrationAccount}}) {
      const old_data: { getListIntegrationAccounts: IIntegrationAccount[] } = cache.readQuery({
        query: GetListIntegrationAccounts,
        variables: {
          platformName: params.platformId,
        }
      });
      cache.writeQuery({
        query: GetListIntegrationAccounts,
        variables: {
          platformName: params.platformId,
        },
        data: {
          getListIntegrationAccounts: [...old_data.getListIntegrationAccounts, addIntegrationAccount]
        }
      });
    }
  });

  const saveAccountHandler = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginUserData.name) {
      setLoginUserData(prev => ({...prev, error_type: 'name', error_text: 'Укажите имя'}))
    } else if (!loginUserData.token) {
      setLoginUserData(prev => ({...prev, error_type: 'token', error_text: 'Укажите токен'}))
    } else if (setUID && !loginUserData.uid) {
      setLoginUserData(prev => ({...prev, error_type: 'uid', error_text: 'Укажите id'}))
    } else {
      addAccountMutation({
        variables: loginUserData
      })
        .then(data => {
          setShow(false);
          setLoginUserData(initAccount)
        })
        .catch(e => {
          setLoginUserData(prev => ({...prev, error_type: 'token', error_text: e.message}))
        })

    }
  }
  return <MyModal show={show} showModal={setShow}>
    <form onSubmit={saveAccountHandler}>
      <p className="flex border-b pb-2">
        <span className="font-semibold text-xl">Добавить аккаунт</span>
        <span
          className="material-icons ml-auto my-auto cursor-pointer text-gray-600"
          onClick={() => setShow(false)}
        >close</span>
      </p>
      {
        setUID && <>
            <p className="mt-4">ID пользователя</p>
            <Input
                className={clsx("mx-0", {'border-red-500': loginUserData.error_type === 'uid'})}
                value={loginUserData.uid}
                placeholder="Введите id ..."
                setValue={value => {
                  setLoginUserData(prev => ({...prev, uid: value, error_text: '', error_type: ''}))
                }}
            />
        </>
      }
      <p className="mt-4">Имя пользователя</p>
      <Input
        className={clsx("mx-0", {'border-red-500': loginUserData.error_type === 'name'})}
        value={loginUserData.name}
        placeholder="Введите имя ..."
        setValue={value => {
          setLoginUserData(prev => ({...prev, name: value, error_text: '', error_type: ''}))
        }}
      />

      <p className="mt-4">Токен доступа</p>
      <Input
        className={clsx("mx-0", {'border-red-500': loginUserData.error_type === 'token'})}
        value={loginUserData.token}
        placeholder="Добавьте токен ..."
        setValue={value => {
          setLoginUserData(prev => ({...prev, token: value, error_text: '', error_type: ''}))
        }}
      />
      {
        loginUserData.error_text &&
        <p className="text-center text-red-500">{loginUserData.error_text}</p>
      }

      <Button
        className="mt-8 w-full"
        type="primary"
        text="Сохранить"
        disabled={!!loginUserData.error_text}
        submit={true}
      />
    </form>
  </MyModal>
}

export default ModalForAddIntegrationAccount