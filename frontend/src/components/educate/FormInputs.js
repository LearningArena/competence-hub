import React from 'react'
import { useRef } from 'react'
import { useContext } from 'react'
import ReactDatePicker from 'react-datepicker'
import { PopupContext } from '../../context/PopupContext'
import Select from 'react-select'
import { ReactComponent as Questionmark } from '../../images/questionmark_square.svg'
import { createContext } from 'react'
import { formActions } from './FormActions'
import { useEffect } from 'react'
import { LanguageContext } from '../../context/LanguageContext'

const FormContext = createContext()

export const Form = ({formData, setFormData, errors, ...props}) => {

  const data = {
    formData,
    errors,
    handleChange: (evt) => formActions.handleChange(setFormData, formData, evt),
    handleMultiDropdownChange: (evt, id) => formActions.handleMultiDropdownChange(setFormData, formData, evt, id),
    handleCheckboxChange: (evt) => formActions.handleCheckboxChange(setFormData, formData, evt),
    handleFileChange: (evt) => formActions.handleFileChange(setFormData, formData, evt),
    handleDateChange: (evt, id) => formActions.handleDateChange(setFormData, formData, evt, id),
  }

  return (
    <FormContext.Provider value={{data}}>
      <form {...props} >
        {props.children}
      </form>
    </FormContext.Provider>
  )

}

const InputCommon = (props) => {
  
  const {showTooltip, hidePopup} = useContext(PopupContext)
  const {data} = useContext(FormContext)
  const ref = useRef()

  return (
    <>
    {props.text && <div className={'labelwrapper' + (props.className ? ` ${props.className}` : '')}>
        <label htmlFor={props.id}>{props.text}{props.required && '*'}</label>
        {props.popupText && 
          <div ref={ref} className='questionmark' onMouseLeave={hidePopup} onMouseOver={(evt) => showTooltip(<span>{props.popupText}</span>, ref)}><Questionmark/></div>
        }
    </div>}
      {props.children}
      {data?.errors?.[props.id] && 
      <div className='error'>{data.errors[props.id]}</div>
      }
      
    </>
  )
}

export const SingleLineInput = (props) => {
  const {id, limit, text, type, popupText, ...rest} = props
  const {data} = useContext(FormContext)
  return (
    <InputCommon key={id} {...props}>
      <input id={id} type={type ? type : "text"} value={data.formData[id]} onChange={data.handleChange} {...rest}/>
      {limit && 
      <span className={data.formData?.[id]?.length > limit ? 'limit over' : 'limit'}>{data.formData[id]?.length ?? 0}/{limit}</span>
      }
    </InputCommon>
  )
}

export const MultiLineInput = (props) => {
  const {id, limit, text, popupText, ...rest} = props
  const {data} = useContext(FormContext)
  return (
    <InputCommon key={id} {...props}>
      <textarea rows='4' id={id} value={data.formData[id]} onChange={data.handleChange} {...rest}/>
      {limit && 
      <span className={data?.formData[id]?.length > limit ? 'limit over' : 'limit'}>{data.formData[id]?.length ?? 0}/{limit}</span>
      }
    </InputCommon>
  )
}
export const ImageInput = (props) => {
  const {id, text, popupText, ...rest} = props
  const {data} = useContext(FormContext)
  return (
    <InputCommon key={id} {...props}>
      <input className='choose-image' type="file" id={id} onChange={data.handleFileChange} {...rest}/>
      {data.formData[id] && <img src={data.formData[id]} {...rest}/>}
    </InputCommon>
  )
}
export const FileInput = (props) => {
  const {id, text, popupText, ...rest} = props
  const {data} = useContext(FormContext)
  return (
    <InputCommon key={id} {...props}>
      <input className='choose-file' type="file" id={id} onChange={data.handleFileChange} {...rest}/>
    </InputCommon>
  )
}
// export const DropdownInput = (props) => {
//   const {id, data, text, items, placeholder, popupText, ...rest} = props
//   return (
//     <InputCommon key={id} {...props}>
//       <select value={data.formData[id]} id={id} onChange={data.handleChange} {...rest}>
//         <option value='-1' disabled defaultValue hidden>{placeholder}</option>
//         {items.map(item => (
//           <option key={item.value} value={item.value}>{item.text}</option>
//         ))}
//       </select>
//     </InputCommon>
//   )
// }
export const DropdownInput = (props) => {
  const {id, disabled, text, items, placeholder, popupText, ...rest} = props
  const {data} = useContext(FormContext)
  const newItems = items.map(item => ({value:item.value,label:item.text}))
  const value = data?.formData?.[id]
  useEffect(() => {
    if (value !== undefined && typeof(value) !== 'object') {
      const newValue = newItems.find(item => item.value == value)
      console.log('updating dropdown', value, 'to', newValue, id)
      data.handleMultiDropdownChange(newValue, id)
    }
  }, [value])

  //const value = (typeof data.formData[id] === 'string') ? [{value:data.formData[id], label:data.formData[id]}] : data.formData[id]
  return (
    <InputCommon key={id} {...props}>
        <Select
          isDisabled={disabled}
          options={newItems}
          placeholder={placeholder}
          id={id}
          onChange={evt => data.handleMultiDropdownChange(evt, id)}
          //closeMenuOnSelect={false}
          isSearchable={false}
          classNamePrefix='dropdown'
          value={value}
          {...rest}
        />
    </InputCommon>
  )
}
export const MultiDropdownInput = (props) => {
  const {id, disabled, text, items, placeholder, popupText, ...rest} = props
  const {data} = useContext(FormContext)
  const value = (typeof data.formData[id] === 'string') ? [{value:data.formData[id], label:data.formData[id]}] : data.formData[id]
  return (
    <InputCommon key={id} {...props}>
        <Select
          isDisabled={disabled}
          options={items}
          placeholder={placeholder}
          isMulti
          id={id}
          isClearable
          classNamePrefix='dropdown'
          onChange={evt => data.handleMultiDropdownChange(evt, id)}
          closeMenuOnSelect={false}
          value={value}
          {...rest}
        />
    </InputCommon>
  )
}

export const DateInput = (props) => {
  const {id, text, popupText, ...rest} = props
  const {data} = useContext(FormContext)
  const {strings} = useContext(LanguageContext)
  
  return (
    <InputCommon key={id} {...props}>
      <ReactDatePicker dateFormat="d MMMM, yyyy" autoComplete='off' placeholderText={strings.placeholders.date} id={id} selected={data.formData[id]} onChange={date => data.handleDateChange(date, id)} {...rest}/>
    </InputCommon>
  )
}
export const CheckboxInput = (props) => {
  const {id, text, popupText, ...rest} = props
  const {data} = useContext(FormContext)
  return (
    <div className='checkbox'>
      <InputCommon key={id} {...props}>
        <input type="checkbox" id={id} onChange={data.handleCheckboxChange} {...rest} />
      </InputCommon>
    </div>
  )
}