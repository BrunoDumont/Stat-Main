//core
import React from "react";

//components
import MenuLeft from "@components/user.auth/PageHeader/Menu.left";
import MenuTop from "@components/user.auth/PageHeader/Menu.top";


const Header: React.FC = () => {
  return (
    <>
      <MenuTop/>
      <MenuLeft/>
    </>
  )
}

export default Header