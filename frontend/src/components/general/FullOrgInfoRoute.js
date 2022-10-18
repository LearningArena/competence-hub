import React, { useContext, useEffect } from 'react'
import { Redirect, Route, useHistory } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext'
import { PopupContext } from '../../context/PopupContext'
import OrgReminderPopup from '../accounts/OrgReminderPopup'

const FullOrgInfoRoute = ({children, ...props}) => {

  const { orgHasMissingFields } = useContext(AuthContext)
  const {showPopup} = useContext(PopupContext)
  const history = useHistory()

  useEffect(() => {
    if (orgHasMissingFields()) {
      showPopup(<OrgReminderPopup />)
      history.goBack()  
    }
  }, [])

  return (
    <Route {...props}>
      {children}
    </Route>
  )
}

export default FullOrgInfoRoute
