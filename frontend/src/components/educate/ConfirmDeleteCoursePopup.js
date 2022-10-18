import { useMutation } from '@apollo/client'
import React from 'react'
import { useContext } from 'react'
import { LanguageContext } from '../../context/LanguageContext'
import { PopupContext } from '../../context/PopupContext'
import { fields } from '../../data/fields'
import { COURSE_DELETE, MY_EDUCATIONS, EDIT_EDUCATION } from '../../data/queries'

const ConfirmDeleteCoursePopup = ({course}) => {

  const {strings} = useContext(LanguageContext)
  const {hidePopup} = useContext(PopupContext)

  console.log(course)

  const [deleteCourseGQL, deletemutationData] = useMutation(COURSE_DELETE, {refetchQueries: [{query: MY_EDUCATIONS}]})
  const [archiveCourseGQL, archivemutationData] = useMutation(EDIT_EDUCATION, {refetchQueries: [{query: MY_EDUCATIONS}]})

  const handleDeleteClick = (evt) => {
    deleteCourseGQL({variables: {id: course.id}}).then(res => {
      console.log(res)
      hidePopup()
    }).catch(err => {
      console.log(err, course.id)
    }) 
  }

  const handleArchiveClick = (evt) => {
    archiveCourseGQL({variables: {id: course.id, record_status: fields.record_status.archived}}).then(res => {
      console.log(res)
      hidePopup()
    }).catch(err => {
      console.log(err, course.id)
    }) 
  }

  return (
    <div className='confirm-delete-course-popup'>
      <div className='title'>
        <h4>{strings.course.popup.confirmDeleteCourse.title}{course.title}?</h4>
        <p>{strings.course.popup.confirmDeleteCourse.message}</p>
      </div>
      <div className= 'button-box'>
        <button className='button button-b'>{strings.course.popup.confirmDeleteCourse.button.cancel}</button> 
        <button onClick={handleArchiveClick} className='button'>{strings.course.popup.confirmDeleteCourse.button.archive}</button>
        <button onClick={handleDeleteClick} className='button'>{strings.course.popup.confirmDeleteCourse.button.remove}</button>
      </div>
    </div>
  )
}

export default ConfirmDeleteCoursePopup
