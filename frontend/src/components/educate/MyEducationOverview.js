import React, { useContext, useState, useEffect } from 'react'
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
import { PaginationContext } from '../../context/PaginationContext'
import { usePagination } from '../../hooks/usePagination'
import { Link, useHistory } from 'react-router-dom'
import { fields } from '../../data/fields'
import { PopupContext } from '../../context/PopupContext'
import ConfirmDeleteCoursePopup from './ConfirmDeleteCoursePopup'
import AddEducationOwnerPopup from './AddEducationOwnerPopup'

const MyEducationOverview = () => {

  const {strings} = useContext(LanguageContext)
  const {showPopup} = useContext(PopupContext)
  const history = useHistory()
  const [loading, setLoading] = useState(true)
  //const category = dummyCategories.find(cat => cat.id === data.categoryID)
  const [courses, setCourses] = useState([])

  const { PaginationControls, getCurrent, ready } = usePagination(MY_EDUCATIONS, 10, PaginationContext)

  useEffect(() => {
    if (!ready) {
      setLoading(true)
      return
    }
    getCurrent()
      .then(({ loading, error, data }) => {
        setCourses(data.courses.nodes)
        setLoading(false)
      })
  }, [ready])

  const updateCourses = (data) => {
    setCourses(data.courses.nodes)
  }

  const columns = [
    {content: strings.course.title, class:'sortable', sortField: 'title'},
    {content: strings.overview.status, class:'sortable', sortField: 'record_status'},
    {content: strings.overview.startDate, class:'sortable', sortField: 'start_date'},
    {content: '', class: 'last-values one'},
    {content: '', class: 'last-values'},
    {content: '', class: 'last-values'}
  ]

  const generateCourseRow = (course) => {
    const rowClass = course.record_status !== fields.record_status.archived ? 'active-educatons' : 'archived-educations'
    return [
      <Link to={'/learn/course/' + course.id}><h3 className='test'>{course.title}</h3></Link>,
      <p className={rowClass+'text'}>{strings.course.statuses[course.record_status]}</p>,
      <p className='text'>{course.start_date && formatDate(course.start_date)}</p>,
      <button className='button icon-button icon-only table'><EditIcon onClick={() => history.push('/educate/myeducation/edit/' + course.id)} /></button>,
      <button className='button icon-button icon-only table'><CopyIcon onClick={() => history.push('/educate/myeducation/add/' + course.id)} /></button>,
      <button className='button icon-button icon-only table'><OwnerIcon onClick={() => showPopup(<AddEducationOwnerPopup course={course} />, 'popup-basic noscroll')} /></button>,
      <button className='button icon-button icon-only table'><BinIcon onClick={() => showPopup(<ConfirmDeleteCoursePopup course={course}/>)} /></button>
    ]
  }

  return (
    <div className='content overview'>
      <Table className='active-educations' columnInfo={columns} content={
        courses.map(generateCourseRow)
      }/>
      <div className='button-container load-more'>
        <PaginationControls updateFunc={updateCourses} />
      </div>
    </div>

  )
}

export default MyEducationOverview
