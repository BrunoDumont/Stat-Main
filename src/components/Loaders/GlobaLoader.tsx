import React from 'react'

const GlobalLoader: React.FC = () => {
  return (
    <div className="flex h-screen">
      <span className="m-auto animate-pulse text-white text-center p-4 rounded bg-gold">Идет загрузка контента<br/> Пожалуйста подождите</span>
    </div>

  )
}

export default GlobalLoader