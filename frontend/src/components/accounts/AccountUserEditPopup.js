import { useMutation } from '@apollo/client'
import React, { useState } from 'react'
import { useContext } from 'react'
import { useEffect } from 'react'
import { AuthContext } from '../../context/AuthContext'
import { LanguageContext } from '../../context/LanguageContext'
import { PopupContext } from '../../context/PopupContext'
import { CURRENT_USER, EDIT_USER } from '../../data/queries'
import { formActions } from '../educate/FormActions'
import { Form, ImageInput, MultiLineInput, SingleLineInput, DropdownInput } from '../educate/FormInputs'

const AccountUserEditPopup = () => {

    const {setPopupOptions, hidePopup} = useContext(PopupContext)
    const [EditUser, { loading, error }] = useMutation(EDIT_USER,{refetchQueries: [{query: CURRENT_USER}]})
    const {user} = useContext (AuthContext)
    const {strings} = useContext(LanguageContext)
    const [formData, setFormData] = useState({})
    

    // Set formdata
    useEffect(() => {
        setFormData(user)

    }, [])

    const handleSubmit = (evt) => {
        
        console.log(evt)
        
       
        let formWithId = {}
        formWithId = {...formData, id: user.id}
        const formattedData = formActions.formatFormData(formWithId, {
            dropdownFields: ['preference_language']
          })
        //console.log('final data', JSON.stringify(formattedData))
         
        EditUser({variables: formattedData}).then(res => {
          console.log(res)
            console.log('Success')
        })
        
        .catch(error => {
            console.log(error.message);
            console.log('fel')
          });
        

          
    }

    const handleCancel = (evt) => {
        console.log(evt)
        hidePopup()
    }

    return (
        <div>
            <h4 className="centered-header">{strings.editUserInfo}</h4>
            <Form formData={formData} setFormData={setFormData} onSubmit={handleSubmit}>
                
                <SingleLineInput required id='firstname' text={strings.signup.firstName} placeholder={strings.signup.placeholders.firstName} />
                <SingleLineInput required id='lastname' text={strings.signup.lastName} placeholder={strings.signup.placeholders.lastName} />
                <DropdownInput required id='preference_language' text={strings.signup.language} placeholder={strings.signup.placeholders.language}
                    items={[
                        {value:"GB", text:strings.signup.languageAlternatives.english},
                        {value:"SE", text:strings.signup.languageAlternatives.swedish},
                    ]}
                />
                
                <div className='popup-buttons'>
                    <button onClick={handleCancel} className='button button-a'>{strings.account.popup.buttonCancel}</button>
                    <button className='button button-b'>{strings.account.popup.buttonSave}</button>
                </div>
            </Form>
        </div>
    )

}
export default AccountUserEditPopup