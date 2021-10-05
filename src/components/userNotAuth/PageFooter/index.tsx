//core
import React from "react";
import {Link} from "react-router-dom"

const PageFooter: React.FC = () => {
  return (
      <div className='mt-3 p-3 grid grid-cols-2 md:flex md:justify-between border-t border-opacity-50'>
        <div
          className="mb-3 grid col-span-2 md:block text-gray text-left md:text-center md:divide-x md:divide-gray-400">
          <Link to="/userAgreement/">
            <span className="text-gray-600 mx-2">Пользовательское соглашение</span>
          </Link>
          <Link to="/privacyPolicy/">
            <span className="text-gray-600 mx-2">Политика конфиденциальности</span>
          </Link>
        </div>
        <p className="mb-3 text-left text-gray-600 my-auto md:order-first">OPTIMA</p>
        <p className="mb-3 text-right text-gray-600 my-auto">@ 2020 Optima</p>
      </div>

  )
}

export default PageFooter