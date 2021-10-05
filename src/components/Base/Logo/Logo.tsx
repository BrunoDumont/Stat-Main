//core
import React from 'react'

//url
import logo from '@public/images/logo.svg'
import logo_small from '@public/images/logo-small.svg'

const Logo: React.FC = () => {
  return (
    <>
      <img src={logo} className="hidden md:block" alt="logo"/>
      <img src={logo_small} className="md:hidden h-6" alt="logo"/>
    </>
  )
}

export default Logo