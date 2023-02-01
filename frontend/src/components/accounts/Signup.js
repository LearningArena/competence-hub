import { useMutation } from '@apollo/client'
import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { useContext } from 'react'
import { AuthContext, setSignupOrg } from '../../context/AuthContext'
import { useHistory, useRouteMatch } from 'react-router-dom'
import { LanguageContext } from '../../context/LanguageContext'
import { SIGNUP } from '../../data/queries'
import { useQuery } from '@apollo/client'
import { ORG_NAME_BY_ORGID } from '../../data/queries'
import { formActions } from '../educate/FormActions'
import { CheckboxInput, DropdownInput, Form, SingleLineInput } from '../educate/FormInputs'
import { PopupContext } from '../../context/PopupContext'
import OrgEditPopup from './OrgEditPopup'

const Signup = () => {

  const {strings} = useContext(LanguageContext)
  const [formData, setFormData] = useState({})
  const [errors, setErrors] = useState({})
  const [isInitial, setInitial] = useState(true)
  const [isValidOrg, setValidOrg] = useState(false)
  const [isExistingOrg, setExistingOrg] = useState(false)
  const [existingOrgName, setExistingOrgName] = useState()
  const [isPopupShown, setPopupShown] = useState(false)
  const { showPopup, popupActive } = useContext(PopupContext)
  const {signupOrg} = useContext(AuthContext)
  const authContext = useContext(AuthContext)
  const updateSignupOrg = useContext(AuthContext)?.updateSignupOrg
  const history = useHistory()
  const match = useRouteMatch()
  const [signupQuery, signupData] = useMutation(SIGNUP)

  useEffect(() => {
    if (!formData.orgid_se) {
      return
    }
    if (formData.orgid_se.length < 1) {
      return
    }
    const validOrgNr = RegExp('^[0-9]{6}-[0-9]{4}$').test(formData.orgid_se)
    if (validOrgNr) {
      setErrors({})
      setValidOrg(true)
    } else {
      setValidOrg(false)
    }
  }, [formData.orgid_se])

  function OrgName( {orgId} ) {
      const {loading, error, data: orgNameData} = useQuery(ORG_NAME_BY_ORGID, {variables: {orgid: orgId}})
      if (loading) return null;
      if (error) return `Error! ${error}`;
      if (orgNameData.organizations.nodes[0] && orgNameData.organizations.nodes[0].name) {
        setExistingOrg(true)
        setExistingOrgName(orgNameData.organizations.nodes[0].name)
      } else {
        setExistingOrg(false)
        setExistingOrgName("")
      }
      return null
  }

  useEffect(() => {
    if (!popupActive && isPopupShown) {
      setInitial(false)
    }
  }, [popupActive])

  const handleInitialSubmit = (evt) => {
    evt.preventDefault()
    if (isValidOrg) {
      setErrors({})
    } else {
      setErrors({orgid_se: strings.signup.errors.invalidOrgid})
      return
    }
    if (!isExistingOrg && !isPopupShown) {
      updateSignupOrg(formData.orgname, formData.orgid_se)
      showPopup(<OrgEditPopup />)
      setPopupShown(true)
    } else {
      setInitial(false)
    }
  }

  const handleSubmit = (evt) => {
    evt.preventDefault()
    let signupData = {...formData}
    if (!isExistingOrg) {
      signupData = {
        org_address: signupOrg.formData.address,
        org_description: signupOrg.formData.description,
        org_email: signupOrg.formData.email,
        org_image_logo: signupOrg.formData.image_logo,
        org_phonenumber: signupOrg.formData.phonenumber,
        org_website: signupOrg.formData.website,
        ...formData
      }
    }

    if (signupData.password !== signupData.confirm) {
      setErrors({...errors, confirm: strings.signup.errors.passwordMismatch})
      return
    }
    const formattedData = formActions.formatFormData(signupData, {
      dropdownFields: ['preference', 'preference_language'],
      integerFields: ['preference']
    })

    signupQuery({variables: formattedData}).then(res => {
      const status = res?.data?.register;
      if (status === 'EMAIL_ALREADY_EXISTS') {
        setErrors({...errors, confirm: strings.signup.errors.usernameTaken(signupData.email)})
      } else {
        history.push(match.url + '/success')
      }
    }).catch(err => {
      console.log(err)
    })
  }

  return (
    <div className='box box-half'>
      <h4 className='centered-header'>{strings.signup.header}</h4>
      {isInitial ? (
        <Form formData={formData} setFormData={setFormData} errors={errors} className='register-user' onSubmit={handleInitialSubmit}>
          <SingleLineInput required id='firstname' text={strings.signup.firstName} placeholder={strings.signup.placeholders.firstName} />
          <SingleLineInput required id='lastname' text={strings.signup.lastName} placeholder={strings.signup.placeholders.lastName} />
          <SingleLineInput required id='email' type='email' text={strings.email} placeholder={strings.signup.placeholders.email} />
          <SingleLineInput required id='orgname' text={strings.signup.orgName} placeholder={strings.signup.placeholders.orgName} value={isExistingOrg ? existingOrgName : null} />
          <SingleLineInput required id='orgid_se' text={strings.signup.orgNumber} placeholder={strings.signup.placeholders.orgNumber} />
          {isValidOrg ? <OrgName orgId={formData.orgid_se}/> : null }
          <DropdownInput id='preference' popupText={strings.course.popup.usage} text={strings.signup.usage} placeholder={strings.signup.placeholders.usage}
            items={[
              {value:"0", text:strings.signup.usageAlternatives.search},
              {value:"1", text:strings.signup.usageAlternatives.offer},
              {value:"2", text:strings.signup.usageAlternatives.searchAndOffer},
            ]} 
          />
          <DropdownInput required id='preference_language' text={strings.signup.language} placeholder={strings.signup.placeholders.language}
            items={[
              {value:"GB", text:strings.signup.languageAlternatives.english},
              {value:"SE", text:strings.signup.languageAlternatives.swedish},
            ]}
          />
          <CheckboxInput required id='gdpr' text={strings.signup.gdpr} />
          <CheckboxInput id='emailPreference' text={strings.signup.emailPreference} />
          <button className='button'>{strings.signup.header}</button>
        </Form>
      ) : (
        <Form formData={formData} setFormData={setFormData} errors={errors} onSubmit={handleSubmit}>
          <SingleLineInput id='password' type='password' text={strings.signup.password} placeholder={''} />
          <SingleLineInput id='confirm' type='password' text={strings.signup.confirmPassword} placeholder={''} />
          <button className='button'>{strings.signup.confirmPassword}</button>
        </Form>
      )}
    </div>
  )
}

export default Signup