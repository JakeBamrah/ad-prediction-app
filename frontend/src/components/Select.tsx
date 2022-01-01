import React, { FunctionComponent } from 'react'

import clsx from 'clsx'


type SelectProps = {
  selected: boolean
  onSelect: () => void
  leftAlign?: boolean
}
const Select: FunctionComponent<SelectProps> = (props) => {
  const {
    selected,
    leftAlign,
    onSelect,
    children
  } = props

  return (
    <div
      onClick={onSelect}
      className={clsx(
        selected ? "bg-slate-300 text-slate-200" : "bg-transparent",
        leftAlign ? "text-left" : "text-center",
        `rounded-full px-3 py-2 font-light
        select-none duration-100 hover:cursor-pointer
        hover:bg-slate-300 hover:neumorph-light hover:text-slate-200
        `)}>
      {children}
    </div>
  )
}

export default Select
