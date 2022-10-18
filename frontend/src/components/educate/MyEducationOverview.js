import React, { useLayoutEffect } from 'react'
import { useContext } from 'react'
import { LanguageContext } from '../../context/LanguageContext'
import { dummyCourses, dummyCategories } from '../../data/dummy/courses'
import { swedishStrings } from '../../data/strings/swedish'
import { formActions } from './FormActions'
import {ReactComponent as EditIcon} from '../../images/icon-edit.svg'
import {ReactComponent as BinIcon} from '../../images/icon-bin.svg'
import {ReactComponent as OwnerIcon} from '../../images/icon-owner.svg'
import {ReactComponent as CopyIcon} from '../../images/icon-copy.svg'
import Table from '../general/Table'
import { useQuery } from '@apollo/client'
import {formatDate} from '../../util/date'
import { CURRENT_USER, MY_EDUCATIONS } from '../../data/queries'
import { useEffect } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { fields } from '../../data/fields'
import { PopupContext } from '../../context/PopupContext'
import ConfirmDeleteCoursePopup from './ConfirmDeleteCoursePopup'
import AddEducationOwnerPopup from './AddEducationOwnerPopup'

const MyEducationOverview = () => {

  const {strings} = useContext(LanguageContext)
  const {showPopup} = useContext(PopupContext)
  const history = useHistory()
  const {loading, error, data} = useQuery(MY_EDUCATIONS)
  //const category = dummyCategories.find(cat => cat.id === data.categoryID)
  const activeCourses = data?.courses.nodes?.filter(course => course.record_status !== fields.record_status.archived)
  const archivedCourses = data?.courses.nodes?.filter(course => course.record_status === fields.record_status.archived)
  
  const activeColumns = [
    {content: <h4>{strings.overview.activeCourses}</h4>, class:'wide'},
    {content: strings.overview.status, class:'sortable'},
    // {content: strings.overview.quotationRequests, class:'sortable'},
    {content: strings.overview.startDate, class:'sortable'},
    {content: '', class: 'last-values one'},
    {content: '', class: 'last-values'},
    {content: '', class: 'last-values'}
  ]
  const archivedColumns = [
    {content: <h4>{strings.overview.archivedCourses}</h4>, class:'wide'},
    {content: strings.overview.status, class:'sortable'},
    // {content: strings.overview.quotationRequests, class:'sortable'},
    {content: strings.overview.startDate, class:'sortable'},
    {content: '', class: 'last-values one'},
    {content: '', class: 'last-values'},
    {content: '', class: 'last-values'},
  ]

  useEffect(() => {
    console.log(data)
  }, [])

  const generateCourseRow = (course) => [
    <Link to={'/learn/course/' + course.id}><h3 className='test'>{course.title}</h3></Link>,
    <p className='text'>{strings.course.statuses[course.record_status]}</p>,
    <p className='text'>{course.start_date && formatDate(course.start_date)}</p>,
    <button className='button icon-button icon-only table'><EditIcon onClick={() => history.push('/educate/myeducation/edit/' + course.id)} /></button>,
    <button className='button icon-button icon-only table'><CopyIcon onClick={() => history.push('/educate/myeducation/add/' + course.id)} /></button>,
    <button className='button icon-button icon-only table'><OwnerIcon onClick={() => showPopup(<AddEducationOwnerPopup course={course} />, 'popup-basic noscroll')} /></button>,
    <button className='button icon-button icon-only table'><BinIcon onClick={() => showPopup(<ConfirmDeleteCoursePopup course={course}/>)} /></button>
  ]

  return (
    <div className='content overview'>
      <Table className='active-educations' columnInfo={activeColumns} content={
        activeCourses?.map(generateCourseRow)
      }/>
      <Table className='archived-educations' columnInfo={archivedColumns} content={
        archivedCourses?.map(generateCourseRow)
      }/>
    </div>

  )
}

export default MyEducationOverview
