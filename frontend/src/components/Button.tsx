import React, { FunctionComponent } from 'react'


type ButtonProps = {
  onClick?: () => void
  type?: "button" | "submit" | "reset" | undefined
}
const Button: FunctionComponent<ButtonProps> = ({ children, onClick, type }) => {
  return (
    <button
      onClick={onClick}
      type={type}
      className={`
          rounded-md px-3 py-2
          select-none duration-100 bg-slate-200 hover:cursor-pointer font-medium
          bg-transparent hover:bg-slate-300 hover:neumorph-light hover:text-slate-100
          focus:bg-slate-300 focus:outline-none
      `}>
      {children}
    </button>
  )
}

export default Button
