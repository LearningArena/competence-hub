import { useMutation, useQuery } from '@apollo/client'
import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useContext } from 'react'
import {ADD_EDUCATION, MY_EDUCATIONS} from '../../data/queries'
import { PopupContext } from '../../context/PopupContext'
import { AuthContext } from '../../context/AuthContext'
import { LanguageContext } from '../../context/LanguageContext'

import EducationForm from './EducationForm'
import PublishedCoursePopup from './PublishedCoursePopup'

import { makeMultiValue } from '../../util/input'
import { COURSE_BY_ID } from '../../data/queries'
import { formActions } from './FormActions'
import { fields } from '../../data/fields'

const AddEducation = ({jsonData, formData, setFormData}) => { 
  
  const {strings} = useContext(LanguageContext)
  const {organization} = useContext(AuthContext)
  const {showPopup, hidePopup} = useContext(PopupContext)
  const educationId = parseInt(useParams().educationId)
  const {error, data} = useQuery(COURSE_BY_ID, {
    variables: {id: educationId}
  })
  const [addEducationGQL, mutationData] = useMutation(ADD_EDUCATION,{refetchQueries: [{query: MY_EDUCATIONS}]})
  const dateFields = ['start_date', 'end_date', 'registration_end_date']
/*
  useEffect(() => {
    if (jsonData) {
      setFormData(jsonData)
    } else if (data) {
      let filteredData = formActions.parseDates(formActions.filterUnused(data.courses.nodes[0]), dateFields)
      filteredData.title = "copy of " + filteredData.title
      const categoryJson = filteredData.category

      let category = makeMultiValue(strings.categories, categoryJson)
      let language = makeMultiValue(strings.languages, filteredData.language)

      const overwriteOrgFields = {education_provider: organization?.name, image_provider: organization?.image_logo}
      // Set a copy of a course as draft initially
      const record_status = {value: fields.record_status.draft, label: strings.course.statuses[fields.record_status.draft]}
      //const {credits} = formActions.formatFloats(filteredData,['credits'])
      setFormData(prev => ({...prev, ...filteredData, id:educationId, category, language, record_status, ...overwriteOrgFields}))

    }
  }, [jsonData, data])
*/
  const submitForm = (data) => {
    addEducationGQL({variables: data}).then(res => {
      console.log(res)
      showPopup(<PublishedCoursePopup hidePopup={hidePopup} published={data.record_status === fields.record_status.approved} />)
    }).catch(err => {
      console.log(err, data)
    })
  }

  // const handleDownload = (evt) => {
  //   evt.preventDefault()
  //   var a = document.createElement("a");
  //   const filteredFormData = formatFormData()
  //   var file = new Blob([JSON.stringify(filteredFormData)], {type: 'application/json'});
  //   console.log(ADD_EDUCATION)
  //   a.href = URL.createObjectURL(file);
  //   a.download = formData.title ? (formData.title + '.json') : 'course.json';
  //   a.click();
  // }

  if (error) console.log(error)
  return (
    <div className='add-education'>
      <EducationForm formData={formData} setFormData={setFormData} submitForm={submitForm} />
      {/* {process.env.NODE_ENV === 'development' &&
      <button onClick={handleDownload}>Ladda ner kursmaterial</button>
      } */}
    </div>
  )
}

export default AddEducation
