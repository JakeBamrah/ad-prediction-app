import React, { FunctionComponent } from 'react'

import clsx from 'clsx'


type BreadcrumbProps = {
  selected: string
  breadcrumbs: string[]
  onSelect: (selected: string) => void
}
const Breadcrumb: FunctionComponent<BreadcrumbProps> = (props) => {
  const {
    selected,
    breadcrumbs,
    onSelect
  } = props

  const total = breadcrumbs.length
  return (
    <div>
      {breadcrumbs.map((breadcrumb, i) => {
        const active = selected === breadcrumb
        return (
          <div
            key={i}
            onClick={() => onSelect(breadcrumb)}
            className="flex flex-col justify-center">
            <div className="relative flex h-5 w-5 items-center space-x-2 hover:cursor-pointer">
              <div className={clsx(
                active ? "h-5 w-5 -ml-1 border-2 border-emerald-200" : "h-3 w-3 border border-slate-300",
                "absolute rounded-full duration-100",
              )}
              />
              <span
                className={clsx(
                  { "text-sm font-light": !active },
                  { "font-medium": active },
                  "pl-4 mt-0.5 duration-100"
                )}
                >
                {breadcrumb}
              </span>
            </div>
            {i < (total - 1) &&
              <div className="my-2" style={{ paddingLeft: '0.35rem' }}>
                <div className="h-8 w-px bg-slate-300" />
              </div>
            }
          </div>
        )
      })}
    </div>
  )
}

export default Breadcrumb
