import React, {useState} from "react";
import {Button} from "@components/Base/Button";
import {useAppDispatch, useAppSelector} from "@/store/hooks";
import {ImageUploader, Input} from "@components/Base/Input";
import Row from "@components/Base/Row";

//server
import workWithServer from "@core/workWithServer";

//redux
import {setCurrentUser} from "@/store/features/userSlice";
import {addAlert} from "@/store/features/alertSlice";


export default function Settings() {
  const initUser = useAppSelector((state) => state.user.currentUser)
  const dispatch = useAppDispatch()
  const [user, setUser] = useState(initUser)
  const initPassword = {
    oldPassword: '',
    password: '',
    passwordConfirm: '',
    show: false,
  }
  const [passwordData, setPasswordData] = useState(initPassword)
  const [image, setImage] = useState(initUser.avatar)

  return (
    <>
      <p className="font-bold text-xl">Настройки</p>
      <div className="mt-4 w-full p-4 rounded bg-white">
        <Row label="Аватар">
          <ImageUploader image={image} setImage={setImage}/>
        </Row>
        <Row label="Имя пользователя">
          <Input
            value={user.username}
            placeholder="Укажите имя пользователя"
            setValue={(username) => {
              setUser(prev => ({...prev, username}))
            }}
          />
        </Row>
        <Row label="Электронная почта">
          <Input
            value={user.email}
            placeholder="Укажите имя пользователя"
            setValue={(email) => {
              setUser(prev => ({...prev, email}))
            }}
          />
        </Row>
        <Row label="Пароль">
          {
            passwordData.show
              ? <div className="md:flex">
                <Input
                  value={passwordData.oldPassword}
                  placeholder="Текущий пароль"
                  setValue={(oldPassword) => {
                    setPasswordData((prev) => ({...prev, oldPassword}))
                  }}
                />
                <Input
                  value={passwordData.password}
                  placeholder="Новый пароль"
                  setValue={(password) => {
                    setPasswordData((prev) => ({...prev, password}))
                  }}
                />
                <Input
                  value={passwordData.passwordConfirm}
                  placeholder="Повт. новый пароль"
                  setValue={(passwordConfirm) => {
                    setPasswordData((prev) => ({...prev, passwordConfirm}))
                  }}
                />
              </div>
              : <Button type="secondary" text="Изменить пароль" onClick={() => {
                setPasswordData((prev) => ({...prev, show: !prev.show}))
              }}/>
          }

        </Row>
      </div>
      <Button
        className="mt-8 mx-auto"
        classNameText="mx-12"
        type="primary"
        text="Сохранить"
        onClick={() => {
          const form = new FormData()
          if (passwordData.show && passwordData.password !== passwordData.passwordConfirm) {
            return
          }
          if (user.username !== initUser.username) {
            form.append('username', user.username)
          }
          if (user.email !== initUser.email) {
            form.append('email', user.email)
          }

          form.append('password', passwordData.oldPassword)
          form.append('newPassword', passwordData.password)
          form.append('file', image)
          workWithServer.changeUserDate(form)
            .then((data: Message) => {
              dispatch(addAlert(data))
              const newUser = {
                ...user,
                avatar: image
              }
              setUser(newUser)
              setPasswordData(initPassword)
              dispatch(setCurrentUser(newUser))
            })
            .catch((err) => {
              dispatch(addAlert({
                type: 'error',
                message: 'Ошибка соединения'
              }))
            })
        }}
      />
    </>
  )
}