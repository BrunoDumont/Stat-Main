//core
import React, {useState} from "react";

//components
import Logo from "@components/Base/Logo/Logo";
import MyModal from "@components/Modal/Modal";
import ModalHeader from "@components/userNotAuth/PageHeader/Modal/ModalHeader";
import ModalBody from "@components/userNotAuth/PageHeader/Modal/ModalBody";
import {LinkForScroll} from "@components/userNotAuth/PageHeader/utils/utils";

type ModalType = 'login' | 'signUp'

const PageHeader: React.FC = () => {
  const [showModal, setShowModal] = useState(false)
  const [modalType, setModalType] = useState('') // login or signUp

  const login = () => {
    setShowModal(true)
    setModalType('login')
  }
  const signUp = () => {
    setShowModal(true)
    setModalType('signUp')
  }

  return (
    <>
      <div className="p-4 md:px-8 grid grid-cols-2 md:grid-cols-6">
        <div>
          <Logo/>
        </div>
        <div className="items-center ml-auto">
          <span className="text-gold px-2 cursor-pointer" onClick={login}>Вход</span>
          <span className="text-gold px-2 cursor-pointer" onClick={signUp}>Регистрация</span>
        </div>
      </div>
      <MyModal show={showModal} showModal={setShowModal}>
        <ModalHeader/>
        <ModalBody type={modalType} setType={setModalType}/>
      </MyModal>
    </>
  )
}


export default PageHeader