import React from 'react'

const LocalLoader: React.FC = () => {
  return (
    <div className="flex">
      <span className="m-auto animate-pulse text-white text-center p-4 rounded bg-gold">Идет загрузка контента<br/> Пожалуйста подождите</span>
    </div>

  )
}

export default LocalLoader