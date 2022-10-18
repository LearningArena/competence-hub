import React from 'react'
import { LanguageContext } from '../../context/LanguageContext'
import { useContext } from 'react'




const UserItem = ({img, name, email}) => {

    const {strings} = useContext(LanguageContext)
    
    const initials = name.split(' ').reduce((result, currentWord) => 
    result + currentWord.charAt(0).toUpperCase(), ''); 

   return (
   <>
   <li className='user-item'>
        <span className='user-image'>
           {img ? <img src={img} alt=''/> :  <h3 className='initals'>{name ? initials : 'XX'}</h3>}
        </span>
        <span className='user-info'>
            <span className='user-name'><h3>{name}</h3></span>
            <span className='user-email'>{email}</span>
            <button className='button button-b delete-button'>{strings.account.deleteButton}</button>
        </span>
       
    </li>
    </>
    )
}

const OrgAllUsers = () => {
   
    const {strings} = useContext(LanguageContext)

    return (
        
        <div className='org-all-users org-page'>
            <div className='info-group user-info-row org-info '>
                <div className='org-image'>
                    <span className='org-logo'>
                    <img src='https://ya.se/wp-content/uploads/2020/11/ya-logo-bg-bluetext.svg'/>
                    </span>
                </div>
                <div className="user-info">
                    <ul className='user-info-list'>
                        <li className='user-name'><h3>Yrkesakademin AB</h3></li>
                        <li className='user-type'><h4>org.nr: 111111-1111</h4></li>
                        <li className='user-description'><p>Kort infotext om företaget, max 150 tecken kanske? För annars kommer det bli lite långt och trist att läsa.</p></li>
                        {/* <li className='user-pw'><h4>Lösenord <span className='stars'>********</span></h4></li> */}
                    </ul>
                </div>
            </div>
            <div className='users wrap'>
                <div className='super-users'>          
                <h2>{strings.account.admins}</h2>
                    <ul className='user-list'>
                        {/* {if superuser:} */}
                        <UserItem img='https://www.seas.harvard.edu/sites/default/files/styles/embedded_image_large/public/2019-12/abebe_rediet_square.jpg?itok=DMfoBor9' name='Abebe Nilsson' email='abebe.nilsson@ya.se'/>
                        <UserItem img='https://i1.wp.com/zoft80.com/wp-content/uploads/portrait-square-03.jpg?resize=300%2C300&ssl=1' name='Jon Dough' email='jon.dough@ya.se'/>
                    </ul>
                </div>
                <div className='sub-users'>
                <h2>{strings.account.users}</h2>
                        <ul className='user-list'>
                            {/* {if superuser:} */}
                            <UserItem name='Abebe Nilsson' email='abebe.nilsson@ya.se'/>
                            <UserItem name='Jon Dough' email='jon.dough@ya.se'/>
                            <UserItem name='Bror Hjort' email='bror.hjort@ya.se'/>
                            <UserItem name='Quentin Quebeck' email='quentin.quebec@ya.se'/>
                        </ul>
                </div>
                <div className='add-users'>
                    <button className='button add-user-button'>{strings.account.addButton}</button>
                </div>
            </div>
        </div> 
    )
}

export default OrgAllUsers
