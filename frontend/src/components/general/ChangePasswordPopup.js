import { useMutation } from '@apollo/client'
import React, { useContext } from 'react'
import { useState } from 'react'
import { LanguageContext } from '../../context/LanguageContext'
import { PopupContext } from '../../context/PopupContext'
import { CHANGE_PASSWORD } from '../../data/queries'
import { Form, SingleLineInput } from '../educate/FormInputs'

const ChangePasswordPopup = () => {

  const [formData, setFormData] = useState({
    password: '',
    confirmation: ''
  })
  const [errors, setErrors] = useState({})
  const [changePasswordGQL, _] = useMutation(CHANGE_PASSWORD)
  const {strings} = useContext(LanguageContext)
  const {hidePopup} = useContext(PopupContext)

  const handleSubmit = (evt) => {
    evt.preventDefault()
    console.log(evt)
    if (formData.password !== formData.confirmation) {
      setErrors({confirmation: strings.signup.errors.passwordMismatch})
      return
    }

    changePasswordGQL({variables: {new_password: formData.password}}).then(res => {
      console.log(res)
      hidePopup()
    }).catch(err => {
      console.log(err)
    })
  }

  return (
    <div>
      <h4 className="centered-header">{strings.changePassword}</h4>
      <Form formData={formData} setFormData={setFormData} errors={errors} onSubmit={handleSubmit}>
        <SingleLineInput autoFocus id='password' text={strings.signup.password} type='password' />
        <SingleLineInput id='confirmation' text={strings.signup.repeatPassword} type='password' />
        <div className='popup-buttons'>
          <button className='button button-a'>{'Spara'}</button>
        </div>
      </Form>
    </div>
  )
}

export default ChangePasswordPopup
