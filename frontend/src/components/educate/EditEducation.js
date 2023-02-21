import { useMutation, useQuery } from '@apollo/client'
import React from 'react'
import { useContext } from 'react'
import { useEffect } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { LanguageContext } from '../../context/LanguageContext'
import { PopupContext } from '../../context/PopupContext'
import { fields } from '../../data/fields'
import { COURSE_BY_ID, EDIT_EDUCATION } from '../../data/queries'
import { makeMultiValue } from '../../util/input'
import CourseInformation from '../learn/CourseInformation'
import AddEducation from './AddEducation'
import EducationForm from './EducationForm'
import { AuthContext } from '../../context/AuthContext'
import { formActions } from './FormActions'
import StickyFormButtons from './StickyFormButtons'

const EditEducation = ({formData, setFormData}) => {

  const history = useHistory()
  const {strings} = useContext(LanguageContext)
  const {allUserOrganizations} = useContext(AuthContext)
  const educationId = parseInt(useParams().educationId)
  const {error, data} = useQuery(COURSE_BY_ID, {
    variables: {id: educationId}
  })
  const [editCourseGQL, mutationData] = useMutation(EDIT_EDUCATION)
  const dateFields = ['start_date', 'end_date', 'registration_end_date']

  useEffect(() => {
    if (data) {
      const filteredData = formActions.parseDates(formActions.filterUnused(data.courses.nodes[0]), dateFields)
      console.log(data.courses.nodes[0], filteredData)
      const categoryJson = filteredData.category

      let category = makeMultiValue(strings.categories, categoryJson)
      let language = makeMultiValue(strings.languages, filteredData.language)

      const education_provider= {value: filteredData.education_provider, label: filteredData.education_provider}
      const image_provider= allUserOrganizations.author.find(el => el.name === formData?.education_provider?.value)?.image_logo
      const record_status = {value: filteredData.record_status, label: strings.course.statuses[filteredData.record_status]}
      //const {credits} = formActions.formatFloats(filteredData,['credits'])
      setFormData(prev => ({...prev, ...filteredData, id:educationId, category, language, education_provider, image_provider, record_status}))

    }
  }, [data])

  const submitForm = (data) => {
    const formWithId = {...data, id: educationId}
    editCourseGQL({variables: formWithId}).then(res => {
      console.log(res)
      setFormData(null)
      history.push('/educate/myeducation/overview')
    })
  }

  if (error) console.log(error)
  return data ? (
    <div className='edit-education'>
      <EducationForm formData={formData} setFormData={setFormData} submitForm={submitForm} />
    </div>
  ) : null
}

export default EditEducation
