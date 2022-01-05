import React, { FunctionComponent, useState } from 'react'
import * as yup from 'yup'
import { setIn } from 'final-form'
import { Form, Field } from 'react-final-form'
import clsx from 'clsx'

import Input from './components/Input'
import Button from './components/Button'
import Select from './components/Select'
import Breadcrumb from './components/Breadcrumb'


export type FormValues = {
  [key: string]: number | string | null
}
type Section = "Cognitive" |
  "Psychiatric" |
  "Psychological" |
  "Demographic" |
  "Help"
type FormProps = {
  onSubmit: (values: FormValues) => void
}
const InputForm: FunctionComponent<FormProps> = ({ onSubmit }) => {
  const [section, setSection] = useState<Section>(SECTIONS[0])
  const validationSchema = yup.object().shape({
    AGE: yup.number().min(0).typeError("Must be a valid number"),
    PTEDUCAT: yup.number().min(0).typeError("Must be a valid number"),
    PTGENDER: yup.number().min(0).typeError("Must be a valid number"),
    FATHDEM: yup.number().min(0).typeError("Must be a valid number"),
    MOTHDEM: yup.number().min(0).typeError("Must be a valid number"),
    NPITOTAL: yup.number().min(0).typeError("Must be a valid number"),
    COMP_MEM_SCORE: yup.number().typeError("Must be a valid number"),
    COMP_EXEC_FUNC_SCORE: yup.number().typeError("Must be a valid number"),
    LOG_MEM_IMM_TOTAL: yup.number().min(0).typeError("Must be a valid number"),
    LOG_MEM_DEL_TOTAL: yup.number().min(0).typeError("Must be a valid number"),
    MODHACH_SCORE: yup.number().min(0).typeError("Must be a valid number"),
    ADAS_TOTAL: yup.number().min(0).typeError("Must be a valid number"),
    MMSE: yup.number().min(0).typeError("Must be a valid number"),
    CBBCorrect: yup.number().min(0).typeError("Must be a valid number"),
    CBBError: yup.number().min(0).typeError("Must be a valid number"),
  })

  const validate = async (values: any) => {
    try {
      await validationSchema.validate(values, { abortEarly: false });
    } catch (e: any) {
      return e.inner.reduce((errors: any, error: any) => {
        return setIn(errors, error.path, error.message);
      }, {});
    }
  }

  const handleSubmit = (values: FormValues) => {
    const cast_values = validationSchema.cast(values)
    const to_submit: FormValues = {}
    INPUT_KEYS.forEach(k => {
      to_submit[k] = null
      to_submit['CBB_SCORE_%'] = null
      if (cast_values[k] !== undefined) {
        to_submit[k] = cast_values[k]
      }
    })

    if (cast_values.CBBCorrect && cast_values.CBBError) {
      const denom = cast_values.CBBCorrect + cast_values.CBBError
      to_submit['CBB_SCORE_%'] = (cast_values.CBBCorrect / denom) * 100
    }
    onSubmit(to_submit)
  }

  const initial_values = {
    PTGENDER: 1,
    MOTHDEM: 0,
    FATHDEM: 0
  }

  const nav = navigator.userAgent
  const is_windows = nav.includes('Win')

  return (
    <div
      className={`
        flex relative h-full w-full divide-x divide-slate-300
      `}>
      <div className="basis-1/2">
        <Breadcrumb
          selected={section}
          breadcrumbs={SECTIONS}
          onSelect={(section) => setSection(section as Section)}
        />
      </div>
      <Form
        onSubmit={handleSubmit}
        validate={validate}
        initialValues={initial_values}
        render={({ handleSubmit, errors }) => (
          <form
            onSubmit={handleSubmit}
            className="basis-1/2"
          >
            <div
              className={clsx(
                section === 'Demographic' ? "block" : "hidden",
                "flex flex-col pl-6 h-full basis-1/2 relative space-y-4"
              )}
            >
              <Field name="AGE">
                {({ input, meta }) => (
                  <Input
                    {...input}
                    label="Age"
                    inputMode="decimal"
                    error={meta.touched && meta.error}
                    placeholder=""
                  />
                )}
              </Field>
              <Field name="PTEDUCAT">
                {({ input, meta }) => (
                  <Input
                    {...input}
                    label="Education Years"
                    inputMode="decimal"
                    error={meta.touched && meta.error}
                    placeholder=""
                  />
                )}
              </Field>
              <Field name="PTGENDER">
                {({ input }) => (
                  <div>
                    <label className="pl-2 font-medium text-sm select-none">Gender</label>
                    <div className="flex space-x-4">
                      <div className="basis-1/2">
                        <Select
                          selected={input.value === 1}
                          onSelect={() => input.onChange(1)}
                        >
                          Male
                        </Select>
                      </div>
                      <div className="basis-1/2">
                        <Select
                          selected={input.value === 2}
                          onSelect={() => input.onChange(2)}
                        >
                          Female
                        </Select>
                      </div>
                    </div>
                  </div>
                )}
              </Field>
              <Field name="FATHDEM">
                {({ input }) => (
                  <div>
                    <label className="pl-2 font-medium text-sm select-none">Father Dementia</label>
                    <div className="flex space-x-4">
                      <div className="basis-1/2">
                        <Select
                          selected={input.value === 1}
                          onSelect={() => input.onChange(1)}
                        >
                          Yes
                        </Select>
                      </div>
                      <div className="basis-1/2">
                        <Select
                          selected={input.value === 0}
                          onSelect={() => input.onChange(0)}
                        >
                          No
                        </Select>
                      </div>
                    </div>
                  </div>
                )}
              </Field>
              <Field name="MOTHDEM">
                {({ input }) => (
                  <div>
                    <label className="pl-2 font-medium text-sm select-none">Mother Dementia</label>
                    <div className="flex space-x-4">
                      <div className="basis-1/2">
                        <Select
                          selected={input.value === 1}
                          onSelect={() => input.onChange(1)}
                        >
                          Yes
                        </Select>
                      </div>
                      <div className="basis-1/2">
                        <Select
                          selected={input.value === 0}
                          onSelect={() => input.onChange(0)}
                        >
                          No
                        </Select>
                      </div>
                    </div>
                  </div>
                )}
              </Field>
            </div>

            <div
              className={clsx(
                section === 'Psychiatric' ? "block" : "hidden",
                "flex flex-col pl-6 h-full basis-1/2 relative space-y-4"
              )}
            >
              <Field name="NPITOTAL">
                {({ input, meta }) => (
                  <Input
                    {...input}
                    label="NPI Total"
                    inputMode="decimal"
                    error={meta.touched && meta.error}
                    placeholder=""
                  />
                )}
              </Field>
            </div>

            <div
              className={clsx(
                section === 'Psychological' ? "block" : "hidden",
                "flex flex-col pl-6 h-full basis-1/2 relative space-y-4"
              )}
            >
              <Field name="COMP_MEM_SCORE">
                {({ input, meta }) => (
                  <Input
                    {...input}
                    label="Composite Mem. Score"
                    inputMode="decimal"
                    error={meta.touched && meta.error}
                    placeholder=""
                  />
                )}
              </Field>
              <Field name="COMP_EXEC_FUNC_SCORE">
                {({ input, meta }) => (
                  <Input
                    {...input}
                    label="Composite Exec. Score"
                    inputMode="decimal"
                    error={meta.touched && meta.error}
                    placeholder=""
                  />
                )}
              </Field>
              <Field name="LOG_MEM_IMM_TOTAL">
                {({ input, meta }) => (
                  <Input
                    {...input}
                    label="L.M Immediate total"
                    inputMode="decimal"
                    error={meta.touched && meta.error}
                    placeholder=""
                  />
                )}
              </Field>
              <Field name="LOG_MEM_DEL_TOTAL">
                {({ input, meta }) => (
                  <Input
                    {...input}
                    label="L.M Delayed total"
                    inputMode="decimal"
                    error={meta.touched && meta.error}
                    placeholder=""
                  />
                )}
              </Field>
            </div>

            <div
              className={clsx(
                section === 'Cognitive' ? "block" : "hidden",
                "flex flex-col pl-6 h-full basis-1/2 relative space-y-4"
              )}
            >
              <Field name="MODHACH_SCORE">
                {({ input, meta }) => (
                  <Input
                    {...input}
                    label="MODHACH Score"
                    inputMode="decimal"
                    error={meta.touched && meta.error}
                    placeholder=""
                  />
                )}
              </Field>
              <Field name="ADAS_TOTAL">
                {({ input, meta }) => (
                  <Input
                    {...input}
                    label="ADAS Total"
                    inputMode="decimal"
                    error={meta.touched && meta.error}
                    placeholder=""
                  />
                )}
              </Field>
              <Field name="MMSE">
                {({ input, meta }) => (
                  <Input
                    {...input}
                    label="MMSE"
                    inputMode="decimal"
                    error={meta.touched && meta.error}
                    placeholder=""
                  />
                )}
              </Field>
              <Field name="CBBCorrect">
                {({ input, meta }) => (
                  <Input
                    {...input}
                    label="CBB Correct"
                    inputMode="decimal"
                    error={meta.touched && meta.error}
                    placeholder=""
                  />
                )}
              </Field>
              <Field name="CBBError">
                {({ input, meta }) => (
                  <Input
                    {...input}
                    label="CBB Error"
                    inputMode="decimal"
                    error={meta.touched && meta.error}
                    placeholder=""
                  />
                )}
              </Field>
            </div>

            <div
              className={clsx(
                section === 'Help' ? "block" : "hidden",
                { "windows-scrollbar": is_windows },
                "flex flex-col pl-6 h-full basis-1/2 relative space-y-2",
                "overflow-y-scroll font-light"
              )}
            >
              <h4 className="font-medium pb-1">Overview</h4>
              <p>- Enter the relevant fields for the given patient.</p>
              <p>- Empty fields will be replaced by their mean using the ADNI dataset.</p>
              <p>- Results will <b>not</b> be saved.</p>

              <h4 className="font-medium pt-2 pb-1">Abbreviations</h4>
              <p>- NPI Total: Neuropsychiatric Inventory</p>
              <p>- L.M: Logical Memory</p>
              <p>- MODHACH: Modified Hachinski Scale</p>
              <p>- MMSE: Mini-Mental State Exam</p>
              <p>- CBB: CogState Brief Battery</p>
            </div>

            <div className="absolute font-light bg-slate-100 h-12 w-40 sm:hidden bottom-0 right-0">
            </div>
            <div className="absolute font-light bottom-0 right-0">
              <Button type="submit">
                Predict patient
              </Button>
            </div>
          </form>
        )}
      />
    </div>
  )
}

const SECTIONS: Section[] = [
  "Demographic",
  "Psychiatric",
  "Psychological",
  "Cognitive",
  "Help"
]
const INPUT_KEYS = [
  "AGE", "PTEDUCAT", "PTGENDER",
  "FATHDEM", "MOTHDEM", "NPITOTAL",
  "COMP_MEM_SCORE", "COMP_EXEC_FUNC_SCORE",
  "LOG_MEM_IMM_TOTAL", "LOG_MEM_DEL_TOTAL",
  "MODHACH_SCORE", "ADAS_TOTAL",
  "MMSE", "CBBCorrect", "CBBError"
]

export default InputForm
