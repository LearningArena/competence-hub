import React from 'react'
import { useState } from 'react'
import { useContext } from 'react'
import { LanguageContext } from '../../context/LanguageContext'
import { formActions } from '../educate/FormActions'
import { MultiLineInput, CheckboxInput, Form } from '../educate/FormInputs'
import { AuthContext } from '../../context/AuthContext'
import {ReactComponent as ArrowRightIcon} from '../../images/icon-arrow-right.svg'
import { useMutation, useQuery } from '@apollo/client'
import { QUOTATION_REQUEST } from '../../data/queries'
import OrgReminderPopup from '../accounts/OrgReminderPopup'


const RequestInvoicePopup = ({courseInfo}) => {

  const {strings} = useContext(LanguageContext)
  const {user,organization, orgHasMissingFields} = useContext(AuthContext)


  const [formData, setFormData] = useState({
    message: '',
    send_copy: false
  })

  const [requestQuotationQGL, mutationData] = useMutation(QUOTATION_REQUEST)

 
    
  const handleSubmit = (evt) => {
    evt.preventDefault()

    //send_copy, course_id, request_message_value
    const submissionData = {...formData, course_id: courseInfo.id}
    requestQuotationQGL({variables: submissionData}).then(res => {
      console.log(res)
    }).catch(err => {
      console.log(err)
    })

    console.log(submissionData)
  }

  if (!user) {
    return (
    <div className= 'request-invoice-popup'>
        <h3>Du måste vara inloggad för att kunna begära offert</h3>
    </div>
    )
  } else if (orgHasMissingFields()) {
    return <OrgReminderPopup />
  } else {
    const initialsSender = user.firstname.charAt(0).toUpperCase() + user.lastname.charAt(0).toUpperCase();
    const initialsReceiver = courseInfo.name_of_contact_person.split(' ').reduce((result, currentWord) => 
      result + currentWord.charAt(0).toUpperCase(), '');
  return (
    <div className= 'request-invoice-popup'>
      <Form formData={formData} setFormData={setFormData} onSubmit={handleSubmit} >
      <span className= 'title'>
        <h2 className='centered-header text-light'>{strings.request.popup}</h2>
        <h3 className='centered-header course'>{courseInfo.title}</h3>
      </span>
      <div>
        <MultiLineInput id='request_message_value' text={strings.request.message} placeholder={strings.placeholders.message} />
        <p>{strings.request.extraMessage(courseInfo.name_of_contact_person)}</p>
      </div>
      <div className='contact-cards'>
        <div className= 'sender card'>
          <div className= 'picture'>
          <h3 className='initials-small'>{initialsSender}</h3>
          {/* <img src="https://www.seas.harvard.edu/sites/default/files/styles/embedded_image_large/public/2019-12/abebe_rediet_square.jpg?itok=DMfoBor9"></img> */}
          </div>
          <div className= 'content'>
            <h3>
            <span className='name'>
              {user.firstname} {user.lastname}
            </span></h3>
            <h5>
            <span className='email'>
              {user.email}
            </span>
            </h5>
            <h5>
            <span className='company'>
              {organization.name}
            </span>
            </h5>

          </div>
        </div>
        <div className= 'arrow'>
        <ArrowRightIcon/>
        </div>
        <div className= 'receiver card'>
          <div className= 'picture'>
          <h3 className='initials-small'>{initialsReceiver}</h3>
          {/* <img src="https://i1.wp.com/zoft80.com/wp-content/uploads/portrait-square-03.jpg?resize=300%2C300&amp;ssl=1" alt=""></img> */}
          </div>
          <div className= 'content'>
            <h3>
            <span className='name'>
            {courseInfo.name_of_contact_person}
            </span></h3>
            <h5>
            <span className='email'>
              {courseInfo.email_of_contact_person}
            </span>
            </h5>
            <h5>
            <span className='company'>
              {courseInfo.education_provider}
            </span>
            </h5>
          </div>
        </div>
      </div>
      <div className= 'checkbox'>
        <CheckboxInput id='send_copy' text={strings.request.sendCopy} /> 
      </div>
      <div className='button-box'>
        <button className='button request-invoice'>{strings.request.button}</button>
      </div>

      </Form>
    </div>
  )
  }
}

export default RequestInvoicePopup
