//core
import React from "react";
import {Link} from "react-router-dom";
import clsx from "clsx";

export interface Elem {
  path?: string
  active?: boolean
  icon?: string
  name: string
}

interface ElementNavbar {
  elem : Elem
}

export const ElementNavbar: React.FC<ElementNavbar> = ({elem}) => {
  return (
    <Link className="flex cursor-pointer text-sm whitespace-nowrap" to={`${elem.path}`}>
      <hr className={elem.active ? 'absolute h-12 border border-gold' : 'hidden'}/>

      <span className={clsx("material-icons text-gray-500 p-3", {'text-gold': elem.active})}>
          {elem.icon}
      </span>
      <span className={clsx("align-middle my-auto text-gray-500 pl-1 ", {'text-gold': elem.active})}>
          {elem.name}
      </span>
    </Link>
  )
}