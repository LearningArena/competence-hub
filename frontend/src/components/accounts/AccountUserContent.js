import React from 'react'
import { useContext } from 'react'
import { AuthContext } from '../../context/AuthContext'
import { LanguageContext } from '../../context/LanguageContext'
import { PopupContext } from '../../context/PopupContext'
import ChangePasswordPopup from '../general/ChangePasswordPopup'
import AccountUserEditPopup from './AccountUserEditPopup'

const UserContent = () => {

    const {user} = useContext(AuthContext)
    const {strings} = useContext(LanguageContext)
    const { showPopup } = useContext(PopupContext)
    const {organization} = useContext(AuthContext)
    const {isAuthor} = useContext(AuthContext)
    
    const initials = user.firstname.charAt(0).toUpperCase() + user.lastname.charAt(0).toUpperCase(); 

    if (!user) return null
    
    return (
        <div className="user-content content-left">
            {/* <h2>{strings.account.header}</h2> */}
            <div className='info-group user-info-row'>
                {/* <div className='user-images'>
                    <span className='user-portrait'>
                    <img src="https://www.seas.harvard.edu/sites/default/files/styles/embedded_image_large/public/2019-12/abebe_rediet_square.jpg?itok=DMfoBor9"/>
                    </span>
                    <span className='user-logo'>
                             <img src={organization?.image_logo} className='org-logo-image'/>
                    </span>
                </div> */}
                <div className='org-image'>
                  <span className='org-logo'>
                    <h3 className='initals'>{initials}</h3>
                        {/*img ? <img src={img} alt=''/> :  <h3 className='initals'>{initials}</h3>*/} 
                        {/* <img src={organization?.image_logo} className='org-logo-image'/> */}
                    </span>
                </div>
                <div className="user-info">
                <ul className='user-info-list'>
                    <li className='user-name'>
                        <h3><span className='firstname'>{user.firstname}</span>&nbsp;<span className='surname'>{user.lastname}</span></h3>
                        <span className='user-acount-type'><i>– {strings.account.usageAlternatives[user.preference]}</i></span>
                    </li>                    
                    <li className='user-type'><h4>{isAuthor?strings.account.admin:strings.account.member}</h4></li>
                    <li className='user-email'><a href={'mailto:' + user.email}>{user.email}</a></li>
                    {/* <li className='user-pw'><h4>Lösenord <span className='stars'>********</span></h4></li> */}
                </ul>
                </div>
            </div>
            <div className='more-info'>
            <h4>{strings.account.connectedTo}</h4>
                <h3>{organization?.name}</h3>
                <ul className='org-info-address'>
                    <li className='address-building'>{organization?.address}</li>
                </ul>
            </div>
            <div className='button-group edit-buttons my-account justify-center'> 

            <button className='button ' onClick={() => showPopup(<ChangePasswordPopup />)}>{strings.account.passwordButton}</button>
            <button className='button ' onClick={() => showPopup(<AccountUserEditPopup />)}>{strings.editUserInfo}</button>
            
            {/* If not user super: */}
            {/* <button className='button button-b'>{strings.account.contactAdminButton}</button> */}

            </div>
        </div> 
    )
}

export default UserContent
