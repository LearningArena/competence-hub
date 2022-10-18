import React from 'react'
import { useContext } from 'react'
import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext'
import { PopupContext } from '../../context/PopupContext'
import OrgReminderPopup from './OrgReminderPopup'

const OrgReminder = () => {

  const {organization, orgHasMissingFields} = useContext(AuthContext)
  const {showPopup} = useContext(PopupContext)
  const location = useLocation()

  //const orgHasMissingFields = (org) => Object.values(organization).some(value => value === null)
  //const missingFields = orgHasMissingFields(organization)
  useEffect(() => {
    if (organization) {
      const missingFields = orgHasMissingFields(organization)
      console.log(missingFields)
      if (orgHasMissingFields(organization) && !location.pathname.includes('organisationsinfo')) {
        showPopup(<OrgReminderPopup />)
      }
    }
  }, [organization])

  return null
}

export default OrgReminder
