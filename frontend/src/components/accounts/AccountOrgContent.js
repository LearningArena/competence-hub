import React from 'react'
import { useContext } from 'react'
import { AuthContext } from '../../context/AuthContext'
import { LanguageContext } from '../../context/LanguageContext'
import { PopupContext } from '../../context/PopupContext'
import OrgEditPopup from './OrgEditPopup'


const OrgContent = () => {

  const { strings } = useContext(LanguageContext)
  const { showPopup } = useContext(PopupContext)
  const {user} = useContext(AuthContext)
  const {organization, isAuthor} = useContext(AuthContext)

  return (
    <div className="org-content content-right">
      {/* <h2>Ditt företags information</h2> */}
      <div className='info-group user-info-row org-info'>
        <div className='org-image'>
          <span className='org-logo'>
                <img src={organization?.image_logo} className='org-logo-image'/>
          </span>
        </div>
        <div className="user-info">
          <ul className='user-info-list'>
            <li className='user-name'><h3>{organization?.name}</h3></li>
            <li className='user-type'><h4>org.nr: {organization?.orgid}</h4></li>
            <li className='user-description'><p>{organization?.description}</p></li>
            {/* <li className='user-pw'><h4>Lösenord <span className='stars'>********</span></h4></li> */}
          </ul>
        </div>
      </div>
      <div className='org-details'>
        <div className='org-adress'>
          <h3>{strings.account.address}</h3>
          <ul className='org-info-address'>
            <li>{organization?.address}</li>
            {/* <li className='address-building'>Campus university building</li>
            <li className='address-street'>Storgatan 666</li>
            <li className='address-postal'>101 01 Stockholm</li>
            <li className='address-country'>Sweden</li> */}
          </ul>
        </div>
        <div className='org-contact'>
          <h3>{strings.account.contactInfo}</h3>
          <ul className='org-info-contact'>
            <li className='contact-webb'><a href={organization?.website}>{organization?.website}</a></li>
            <li className='contact-email'><h4><span className='firstname'>{user.firstname}</span>&nbsp;<span className='surname'>{user.lastname}</span></h4></li>
            <li className='contact-email'><a href={`mailto:${organization?.email}`}>{organization?.email}</a></li>
            <li className='contact-telephone'>{organization?.phonenumber}</li>
          </ul>
        </div>
        {/* <div className='org-superusers'>
          <h3>{strings.account.contactPerson}</h3>
          <ul className='org-info-contact'>
            <li className='contact-webb'>
              <span className='contact-name'><h4>Abebe Nilsson</h4></span>
              <span className='user-email'>abebe.nilsson@ya.se</span>
            </li>
            <li className='contact-webb'>
              <span className='contact-name'><h4>Jon Dough</h4></span>
              <span className='user-email'>jon.dough@ya.se</span>
            </li>

          </ul>
        </div> */}
      </div>
      <div className='button-group edit-buttons justify-center'>
        {isAuthor && <button className='button' onClick={() => showPopup(<OrgEditPopup />)}>{strings.account.editButton}</button>}
        {/* If not user super: */}
        {/* <button className='button button-b'>{strings.account.contactAdminButton}</button> */}
      </div>
    </div>
  )
}

export default OrgContent
