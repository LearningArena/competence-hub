import React, { useContext, useEffect } from 'react'
import { Redirect } from 'react-router-dom'
import { PopupContext } from '../../context/PopupContext'
import LoginPopup from './LoginPopup'

const LoginRoute = (props) => {

  const {showPopup} = useContext(PopupContext)

  useEffect(() => {
    showPopup(<LoginPopup />)
  },[])

  return (
    <Redirect to='/' />
  )
}

export default LoginRoute
