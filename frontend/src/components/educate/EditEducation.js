import { useMutation, useQuery } from '@apollo/client'
import React from 'react'
import { useContext } from 'react'
import { useEffect } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext'
import { LanguageContext } from '../../context/LanguageContext'
import { PopupContext } from '../../context/PopupContext'
import { fields } from '../../data/fields'
import { COURSE_BY_ID, EDIT_EDUCATION } from '../../data/queries'
import { makeMultiValue } from '../../util/input'
import CourseInformation from '../learn/CourseInformation'
import AddEducation from './AddEducation'
import EducationForm from './EducationForm'
import { formActions } from './FormActions'
import StickyFormButtons from './StickyFormButtons'

const EditEducation = ({formData, setFormData}) => {

  const history = useHistory()
  const {strings} = useContext(LanguageContext)
  const {organization} = useContext(AuthContext)
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

      const overwriteOrgFields = {education_provider: organization?.name, image_provider: organization?.image_logo}
      const record_status = {value: filteredData.record_status, label: strings.course.statuses[filteredData.record_status]}
      //const {credits} = formActions.formatFloats(filteredData,['credits'])
      setFormData(prev => ({...prev, ...filteredData, id:educationId, category, language, record_status, ...overwriteOrgFields}))

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
