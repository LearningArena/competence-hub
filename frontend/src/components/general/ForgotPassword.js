import { useMutation } from '@apollo/client'
import React from 'react'
import { useState } from 'react'
import { useContext } from 'react'
import { LanguageContext } from '../../context/LanguageContext'
import { FORGOT_PASSWORD } from '../../data/queries'
import ForgotPasswordSend from './ForgotPasswordSend'
import { PopupContext } from '../../context/PopupContext'
import { Form, SingleLineInput } from '../educate/FormInputs'

const ForgotPassword = () => {

  const {strings} = useContext(LanguageContext)
  const { showPopup } = useContext(PopupContext)
  const [forgotPasswordGQL, _] = useMutation(FORGOT_PASSWORD)
  const [formData, setFormData] = useState({})

  const handleSubmit = (evt) => {
    evt.preventDefault()
    forgotPasswordGQL({variables: formData}).then(res => {
      console.log(res)
    }).catch(err => {
      console.log(err)
    })
    showPopup(<ForgotPasswordSend />)
  }

  return (
    <div>
      <h4 className='centered-header'>{strings.resetPassword.header}</h4>
      <p>{strings.resetPassword.description}</p>
      <Form formData={formData} setFormData={setFormData} onSubmit={handleSubmit}>
        <SingleLineInput id='email' type='email' text={strings.email} placeholder={strings.signup.placeholders.email} />
        <div className='popup-buttons'>
          <button className='button'>{strings.resetPassword.send}</button>

          {/* <button className='button' onClick={() => {showPopup(<ForgotPasswordSend />); this.form.dispatchEvent(new Event('submit')); }}>{strings.resetPassword.send}</button>  */} 
          
        </div>
      </Form>
    </div>
  )
}

export default ForgotPassword
