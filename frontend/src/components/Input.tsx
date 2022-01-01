import React, { FunctionComponent, useRef, useState, RefObject } from 'react'
import clsx from 'clsx'
import { X } from 'react-feather'


type InputProps = {
  label: string
  value: string
  pattern?: string
  inputMode?: "search" |
    "text" | "decimal" | "none" |
    "tel" | "url" | "email" |
    "numeric" | undefined
  error?: boolean
  placeholder: string
  input_ref?: RefObject<HTMLInputElement>
  canClear?: boolean
  onChange: (val: string) => void
  onBlur?: () => void
  Shortcut?: () => JSX.Element
}
const Input: FunctionComponent<InputProps> = (props) => {
  const {
    input_ref,
    label,
    inputMode,
    value,
    pattern,
    error,
    placeholder,
    canClear,
    onChange,
    Shortcut
  } = props

  const defaultRef = useRef<HTMLInputElement>(null)
  const inputEl = input_ref ? input_ref : defaultRef

  const [original_value, setOriginalValue] = useState<string>("")

  const handleKeyDown = (e: any) => {
    if (e.key === 'Escape' && inputEl.current) {
      inputEl.current?.blur()
      // restore the original value on escape, unless the input was left empty
      if (value.trim().length === 0) {
        onChange("")
        setOriginalValue("")
        return
      }

      onChange(original_value)
      return
    }

    if (e.key === 'Enter' && inputEl.current) {
      onChange(value.trim())
      inputEl.current?.blur()
      return
    }
  }

  const handleBlur = () => {
    // store original value on clickaways too
    // the new_value has been handled by either the onChange or keyHandler
    // by this point so we can be sure of value correctness
    setOriginalValue(value.trim())
  }

  const empty = value.length === 0

  return (
    <div className="w-full flex flex-col">
      {label &&
        <label className="pl-2 font-medium select-none">{label}</label>
      }
      <div
        className={clsx(
          error ? "border-red-300" : "border-slate-250",
          "w-full border bg-slate-250 dark:bg-dark-400 rounded-3xl px-4 pt-1.5 pb-1.5 relative flex items-center"
        )}>
        <input
          ref={inputEl}
          value={value}
          pattern={pattern}
          inputMode={inputMode}
          onChange={e => onChange(e.target.value)}
          onBlur={handleBlur}
          placeholder={placeholder}
          onKeyDown={handleKeyDown}
          className={clsx(
            { "mr-6": canClear && !empty },
            "border-none font-light focus:outline-none ring-0 bg-transparent dark:bg-dark-400 w-full placeholder-slate-400 dark:placeholder-dark-300 truncate"
          )}
        />
        {empty && Shortcut &&
          <div className="hidden sm:block absolute right-0 text-xs mr-4">
            <Shortcut />
          </div>
        }
        {!empty && canClear &&
          <div
            onClick={() => { onChange(""); setOriginalValue("") }}
            className="absolute right-0 text-xs mr-4 cursor-pointer hover:bg-white dark:hover:bg-dark-500 rounded-xl p-0.5"
          >
            <span className="text-slate-400 dark:text-dark-300 ">
              <X size={16} />
            </span>
          </div>
        }
      </div>
    </div>
  )
}

export default Input
