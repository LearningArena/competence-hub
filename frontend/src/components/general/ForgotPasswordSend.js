import { useMutation } from '@apollo/client'
import React from 'react'
import { useState } from 'react'
import { useContext } from 'react'
import { LanguageContext } from '../../context/LanguageContext'
import { FORGOT_PASSWORD } from '../../data/queries'

const ForgotPasswordSend = () => {

  const {strings} = useContext(LanguageContext)
  const [forgotPasswordGQL, _] = useMutation(FORGOT_PASSWORD)
  const [formData, setFormData] = useState({})



  return (
    <div>
      <h4 className='centered-header'>{strings.resetPassword.header}</h4>
      <p>{strings.resetPassword.confirm}</p>

    </div>
  )
}

export default ForgotPasswordSend
