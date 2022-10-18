import React from 'react'
import { useContext } from 'react'
import { Link } from 'react-router-dom'
import { LanguageContext } from '../../context/LanguageContext'

const PublishedCoursePopup = ({hidePopup, published}) => {

  const {strings} = useContext(LanguageContext)

  return (
    <div className='confirm-course-popup'>
    <h4>{published ? strings.popup.ConfirmCoursePopup.titlePublished : strings.popup.ConfirmCoursePopup.titleNotPublished}</h4>
    <div className= 'button-box'>
    <Link to='/educate/myeducation/overview'>
      <button onClick={hidePopup} className='button'>{strings.popup.ConfirmCoursePopup.overview}</button>
    </Link>
    <Link to='/educate/myeducation/add'>
      <button onClick={hidePopup} className='button'>{strings.popup.ConfirmCoursePopup.create}</button>
    </Link>
    </div>
    </div>
  )
}

export default PublishedCoursePopup
