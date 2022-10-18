import React from 'react'
import { useState } from 'react'
import { useContext } from 'react'
import { LanguageContext } from '../../context/LanguageContext'
import { Form, SingleLineInput } from '../educate/FormInputs'

const ForgotPasswordTemporary = () => {

  const {strings} = useContext(LanguageContext)
  const [formData, setFormData] = useState({})

  const handleSubmit = (evt) => {
    evt.preventDefault()
  }
//support@kompetensmatchning.se
  return (
    <div>
      <h4 className='centered-header'>{strings.resetPassword.header}</h4>
      <p style={{textAlign: 'center'}}>
        Tjänsten har för närvarande inte stöd för automatisk återställning av lösenord.
        Kontakta <a href='mailto:support@kompetensmatchning.se'>support@kompetensmatchning.se</a> så hjälper vi dig
        så snart som möjligt.
      </p>
      {/* <p>{strings.resetPassword.description}</p>
      <Form formData={formData} setFormData={setFormData} onSubmit={handleSubmit}>
        <SingleLineInput id='email' type='email' text={strings.email} placeholder={strings.signup.placeholders.email} />
        <div className='popup-buttons'>
          <button className='button'>{strings.resetPassword.send}</button>
        </div>
      </Form> */}
    </div>
  )
}

export default ForgotPasswordTemporary