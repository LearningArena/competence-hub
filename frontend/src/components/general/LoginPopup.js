import { useMutation, useQuery } from '@apollo/client'
import React from 'react'
import { useState } from 'react'
import { useContext } from 'react'
import { Link } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext'
import { LanguageContext } from '../../context/LanguageContext'
import { PopupContext } from '../../context/PopupContext'
import { AUTHTEST, CURRENT_USER, CURRENT_USER_ORG, LOGIN, MY_EDUCATIONS } from '../../data/queries'
import { Form, SingleLineInput } from '../educate/FormInputs'
import ForgotPassword from './ForgotPassword'
import ForgotPasswordTemporary from './ForgotPasswordTemporary'

const LoginPopup = () => {

  const {showPopup, hidePopup} = useContext(PopupContext)
  const {strings} = useContext(LanguageContext)
  //const {updateAuth} = useContext(AuthContext)
  const updateAuth = useContext(AuthContext)?.updateAuth
  const [loginGQL, loginData] = useMutation(LOGIN,{refetchQueries: [
    {query: MY_EDUCATIONS},
    {query: CURRENT_USER_ORG},
  {query: CURRENT_USER}]})
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  })
  const [errors, setErrors] = useState({})


  const handleSubmit = (evt) => {
    evt.preventDefault()
    console.log('submitting login:', formData)
    loginGQL({
      variables: formData
    }).then(res => {
      const response = res?.data?.login
      if (res.data.login.error) {
        setErrors({password: res.data.login.error_description})
        return
      }
      if (response.status === 'Need_Verification') {
        setErrors({password: response.text})
        return
      } else if (response.status === 'Keycloak') {
        setErrors({password: strings.invalidLogin})
        return
      }
      console.log(res)
      //return
      localStorage.setItem('token', res.data.login.access_token)
      hidePopup()
      updateAuth()
    }).catch(err => {
      console.log(err)
    })
  }

  return (
    <div className= 'login-popup'>
      <h4 className='centered-header'>{strings.login}</h4>
      <Form formData={formData} errors={errors} setFormData={setFormData} onSubmit={handleSubmit}>
        <SingleLineInput autoFocus id='username' text={strings.email} />
        <SingleLineInput id='password' text={strings.password} type='password' />
        <div className='popup-buttons'>
          <button className='button button-a'>{strings.login}</button>

        </div>
      </Form>
      <div className='additional'>
        <Link onClick={() => showPopup(<ForgotPassword />)} className='forgot-password'>{strings.forgotPassword}</Link> {strings.signup.or} <Link to='/learn/signup' onClick={hidePopup}>{strings.signup.header}</Link>   
      </div>  
    </div>
  )
}

export default LoginPopup
