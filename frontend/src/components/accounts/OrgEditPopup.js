import { useMutation } from '@apollo/client'
import React, { useState } from 'react'
import { useContext } from 'react'
import { useEffect } from 'react'
import { AuthContext } from '../../context/AuthContext'
import { LanguageContext } from '../../context/LanguageContext'
import { PopupContext } from '../../context/PopupContext'
import { CURRENT_USER_ORG, ADD_ORG, EDIT_ORG } from '../../data/queries'
import { formActions } from '../educate/FormActions'
import { Form, ImageInput, MultiLineInput, SingleLineInput } from '../educate/FormInputs'

const OrgEditPopup = () => {

  const {setPopupOptions, hidePopup} = useContext(PopupContext)
  const {strings} = useContext(LanguageContext)
  const {organization} = useContext(AuthContext)
  const {signupOrg} = useContext(AuthContext)
  const updateSignupOrg = useContext(AuthContext)?.updateSignupOrg
  const authContext = useContext(AuthContext)
  const [formData, setFormData] = useState({})
  const [editOrganizationGQL] = useMutation(EDIT_ORG, {refetchQueries: [{query: CURRENT_USER_ORG}]})
  const [createOrganizationGQL] = useMutation(ADD_ORG)

  useEffect(() => {
    console.log("Authcontext is", authContext)
    setPopupOptions({noDismiss: true})
    if (organization) {
      setFormData(organization)
    } else if (signupOrg) {
      setFormData({name: signupOrg.name})
    }
    return () => {
      setPopupOptions(null)
    }
  }, [])


  const handleSubmit = (evt) => {
    evt.preventDefault()
    console.log(formData)
    let formWithId = {}
    if (signupOrg) {
      // We are creating a new org 
      formWithId = {...formData, orgid_se: signupOrg.orgId}
      updateSignupOrg(formData.name, formData.orgid_se, formData)
      hidePopup()
    } else {
      formWithId = {...formData, id: organization.id}
      // We are editing an existing org
      editOrganizationGQL({variables: formWithId}).then(res => {
        console.log(res)
        hidePopup()
      })
    }
  }

  const handleCancel = (evt) => {
    evt.stopPropagation()
    hidePopup()
  }

  return (
    <Form formData={formData} setFormData={setFormData} onSubmit={handleSubmit}>
    <div>
      <h4>{strings.account.popup.title}</h4>
    </div>
    

    <div className='columns'>
      <div className='column-left'>
        <SingleLineInput id='name' limit={50} text={strings.account.popup.orgName} placeholder={strings.account.popup.placeholders.orgName}/>
        <SingleLineInput id='website' type='text' limit={50} text={strings.account.popup.homepage} placeholder={strings.account.popup.placeholders.homepage}/>
      </div>
      <div className='column-right'>
        <ImageInput className='choose-image negative' id='image_logo'/>
        <span className= 'upload-specifications'>{strings.account.popup.imageUpload}</span>
      </div>
    </div>
      <SingleLineInput id='description' limit={300} text={strings.account.popup.description} placeholder={strings.account.popup.placeholders.description}/>
      <MultiLineInput id='address' limit={50} text={strings.account.popup.address} placeholder={strings.account.popup.placeholders.address}/>
    <div className='columns'>
      <div className='column-left'>
        <SingleLineInput id='email' type='email' limit={50} text={strings.account.popup.email} placeholder={strings.account.popup.placeholders.email}/>
      </div>
      <div className='column-right'>
        <SingleLineInput id='phonenumber' type='text' limit={50} text={strings.account.popup.phonenumber} placeholder={strings.account.popup.placeholders.phonenumber}/>
      </div>
    </div>
    <p className='subtitle'>{strings.account.popup.disclaimer}</p>

    <div className='popup-buttons'>
      <button onClick={handleCancel} className='button button-b'>{strings.account.popup.buttonCancel}</button>
      <button className='button button-a'>{strings.account.popup.buttonSave}</button>
    </div>
    
    </Form>
  )
}

export default OrgEditPopup
