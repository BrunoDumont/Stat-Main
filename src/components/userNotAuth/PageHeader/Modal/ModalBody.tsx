//core
import React from "react"

//components
import ToggleBodyContent from "@components/userNotAuth/PageHeader/Modal/ToggleBodyContent";
import ModalBodyLogin from "@components/userNotAuth/PageHeader/Modal/ModalBodyLogin";
import ModalBodySignUp from "@components/userNotAuth/PageHeader/Modal/ModalBodySignUp";


type ModalBodyType = {
  type: string,
  setType: (elem: string) => void
}

const ModalBody: React.FC<ModalBodyType> = ({type, setType}) => {

  const body_jsx = type === 'login' ? <ModalBodyLogin/> : <ModalBodySignUp/>

  return (
    <div>
      <ToggleBodyContent type={type} setType={setType}/>
      {body_jsx}
    </div>
  )
}

export default ModalBody











