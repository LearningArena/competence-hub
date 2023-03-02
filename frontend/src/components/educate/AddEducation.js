import { useMutation, useQuery } from '@apollo/client'
import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useContext } from 'react'
import {ADD_EDUCATION, MY_EDUCATIONS, ORG_INFO_BY_ID} from '../../data/queries'
import { PopupContext } from '../../context/PopupContext'
import { AuthContext } from '../../context/AuthContext'
import { LanguageContext } from '../../context/LanguageContext'
import EducationForm from './EducationForm'
import PublishedCoursePopup from './PublishedCoursePopup'

import { fields } from '../../data/fields'

const AddEducation = ({jsonData, formData, setFormData}) => { 
  
  const {strings} = useContext(LanguageContext)
  const {showPopup, hidePopup} = useContext(PopupContext)
  const [addEducationGQL, mutationData] = useMutation(ADD_EDUCATION,{refetchQueries: [{query: MY_EDUCATIONS}]})
  const dateFields = ['start_date', 'end_date', 'registration_end_date']
  const orgId = parseInt(useParams().orgId)
  const {organization, allUserOrganizations} = useContext(AuthContext)

  const submitForm = (data) => {
    data.education_provider_id = allUserOrganizations.author.find(el => el.name === data?.education_provider)?.id
    addEducationGQL({variables: data}).then(res => {
      console.log(res)
      showPopup(<PublishedCoursePopup hidePopup={hidePopup} published={data.record_status === fields.record_status.approved} />)
    }).catch(err => {
      console.log(err, data)
    })
  }

  return (
    <div className='add-education'>
      <EducationForm formData={formData} setFormData={setFormData} submitForm={submitForm} />
    </div>
  )
}

export default AddEducation
