import React, { useContext, useEffect } from 'react'
import { AuthContext } from '../../context/AuthContext'
import { PopupContext } from '../../context/PopupContext'
import ChangePasswordPopup from './ChangePasswordPopup'

const ChangePasswordTrigger = () => {

  const {passwordResetMode} = useContext(AuthContext)
  const {showPopup} = useContext(PopupContext)

  useEffect(() => {
    if (passwordResetMode) {
      showPopup(<ChangePasswordPopup />)
    }
  }, [passwordResetMode])

  return null
}

export default ChangePasswordTrigger
