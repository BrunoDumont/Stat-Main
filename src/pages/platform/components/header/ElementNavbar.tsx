//core
import React, {useState} from "react";
import {Link} from "react-router-dom";
import clsx from "clsx";
import CSSTransition from "react-transition-group/CSSTransition";

//styles
import './elementNavbar.css'

interface Elem {
  path?: string
  active?: () => boolean
  icon?: string
  name: string
  child?: Array<Elem>
  onClick?: () => void
}

interface ElementNavbar {
  elem : Elem
}

export const ElementNavbar: React.FC<ElementNavbar> = ({elem}) => {

  return (
    <Link className="flex cursor-pointer text-sm whitespace-nowrap" to={`${elem.path}`} onClick={() => {
      if(typeof elem.onClick === 'function') elem.onClick()
    }}>
      <hr className={elem.active() ? 'absolute h-12 border border-gold' : 'hidden'}/>
      <span className={clsx("material-icons text-gray-500 p-3", {'text-gold': elem.active()})}>
          {elem.icon}
      </span>
      <span className={clsx("align-middle my-auto text-gray-500 pl-1 ", {'text-gold': elem.active()})}>
          {elem.name}
      </span>
    </Link>
  )
}