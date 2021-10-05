import React from 'react'


type SelectableButtonTypes = 'primary' | 'secondary' | 'withoutText'

interface IError {
  message: Message
  className?: string
}

export const Error: React.FC<IError> = ({message, className}) => {
  const classes = [
    'rounded-md px-2 py-1 place-content-center focus:outline-none flex '
  ]

  classes.push(className)

  if (message.type === 'error') classes.push('text-white bg-gold hover:bg-gold-hover')
  // else if (type === 'withoutText') classes.push('text-gray-600 bg-gray-200')
  return  <p className="text-xs text-red-400 pl-2 mt-1 ">
    <i className="material-icons mr-2 text-base align-middle">warning</i>
    <span className="my-auto">{message.message}</span>
  </p>
}