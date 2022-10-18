import React from 'react'
import { useContext } from 'react'
import { LanguageContext } from '../../context/LanguageContext'
import { Link } from 'react-router-dom'
import { PopupContext } from '../../context/PopupContext'

const OrgReminderPopup = ({missingFields}) => {

  const {strings} = useContext(LanguageContext)
  const {hidePopup} = useContext(PopupContext)
  

  return (
    <div className='confirm-delete-course-popup'>
      <div className= 'title'>
        <h4>{strings.popup.OrgReminderPopup.title}</h4>
        <p>{strings.popup.OrgReminderPopup.message}</p>
      </div>
      {missingFields && missingFields.map(field => (
        <div>{strings.popup.OrgReminderPopup.fields[field]}</div>
      ))}
      <div className= 'button-box'>
        <Link className='button' to='/learn/account/organisationsinfo' onClick={hidePopup} >{strings.popup.OrgReminderPopup.button}</Link>
      </div>
    </div>
  )
}

export default OrgReminderPopup
