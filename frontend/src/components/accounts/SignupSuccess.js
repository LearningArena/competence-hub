import React from 'react'
import { useContext } from 'react'
import { useHistory } from 'react-router-dom'
import { LanguageContext } from '../../context/LanguageContext'
import {ReactComponent as CongratsIcon} from '../../images/icon-congrats.svg'

const SignupSuccess = () => {

  const {strings} = useContext(LanguageContext)
  const history = useHistory()

  return (
    <div className='box box-half  signupsucces'>
      <h4>{strings.signup.almostReadyHeader}</h4>
      <CongratsIcon />
      <p>{strings.signup.almostReadyText}</p>
      <button className='button' onClick={() => history.push('/')} >{strings.signup.almostReadyConfirmation}</button>
    </div>
  )
}

export default SignupSuccess
