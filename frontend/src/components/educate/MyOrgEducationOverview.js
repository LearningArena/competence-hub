import React, { useContext, useState } from 'react'
import { LanguageContext } from '../../context/LanguageContext'
import {ReactComponent as EditIcon} from '../../images/icon-edit.svg'
import {ReactComponent as BinIcon} from '../../images/icon-bin.svg'
import {ReactComponent as OwnerIcon} from '../../images/icon-owner.svg'
import {ReactComponent as CopyIcon} from '../../images/icon-copy.svg'
import Table from '../general/Table'
import {formatDate} from '../../util/date'
import { CURRENT_USER, MY_EDUCATIONS, USER_ORG_EDUCATIONS } from '../../data/queries'
import { useEffect } from 'react'
import { PaginationContext } from '../../context/PaginationContext'
import { usePagination } from '../../hooks/usePagination'
import { Link, useHistory } from 'react-router-dom'
import { fields } from '../../data/fields'
import { PopupContext } from '../../context/PopupContext'
import ConfirmDeleteCoursePopup from './ConfirmDeleteCoursePopup'
import AddEducationOwnerPopup from './AddEducationOwnerPopup'
import { AuthContext } from '../../context/AuthContext'

const MyOrgEducationOverview = () => {

  const {strings} = useContext(LanguageContext)
  const {showPopup} = useContext(PopupContext)
  const {user} = useContext(AuthContext)
  const history = useHistory()
  const [activeCourses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)

  const { getCurrent, getPage, pageNum, pageCursors, ready } = usePagination(USER_ORG_EDUCATIONS, 4, PaginationContext)

  useEffect(() => {
    if (!ready) {
      setLoading(true)
      return
    }
    getCurrent({ variables: { userid: user.id } })
      .then(({ loading, error, data }) => {
        setCourses(data.courses.nodes)
        setLoading(false)
      })
  }, [ready])

  
  const columns = [
    {content: strings.course.title, class:'sortable', sortField: 'title'},
    {content: strings.overview.status, class:'sortable', sortField: 'record_status'},
    {content: strings.course.orgAccount, class:'sortable', sortField: ['organization', 'name']},
    // {content: strings.overview.quotationRequests, class:'sortable'},
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
      <p className='text'>{course.organization?.name}</p>,
      <p className='text'>{course.start_date && formatDate(course.start_date)}</p>,
      <button className='button icon-button icon-only table'><EditIcon onClick={() => history.push('/educate/myeducation/edit/' + course.id)} /></button>,
      <button className='button icon-button icon-only table'><CopyIcon onClick={() => history.push('/educate/myeducation/add/' + course.id)} /></button>,
      <button className='button icon-button icon-only table'><OwnerIcon onClick={() => showPopup(<AddEducationOwnerPopup course={course} />, 'popup-basic noscroll')} /></button>,
      <button className='button icon-button icon-only table'><BinIcon onClick={() => showPopup(<ConfirmDeleteCoursePopup course={course}/>)} /></button>
    ]
  }

  return (
    <div className='content overview org-overview'>
      <Table className='active-educations' columnInfo={columns} content={
        activeCourses.map(generateCourseRow)
      }/>
        <div className='button-container load-more'>
        {pageCursors.map((_, i) =>
          <button className={'button ' + (pageNum == i ? 'inactive':'')} disabled={pageNum == i ? true : false} onClick={() => getPage(i, { variables: { userid: user.id } }).then(
              ({ loading, error, data }) => {
                setCourses(data.courses.nodes)
                setLoading(loading)
          })}>{ i+1 }</button>
        )}
      </div>
    </div>
  )
}

export default MyOrgEducationOverview
