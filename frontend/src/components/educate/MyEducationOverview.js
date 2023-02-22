import React, { useContext, useState, useEffect } from 'react'
import { LanguageContext } from '../../context/LanguageContext'
import { useParams, useLocation } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext'
import queryString from 'query-string'
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
import { CURRENT_USER, MY_EDUCATIONS, ORG_EDUCATIONS } from '../../data/queries'
import { PaginationContext } from '../../context/PaginationContext'
import { usePagination } from '../../hooks/usePagination'
import { Link, useHistory } from 'react-router-dom'
import { fields } from '../../data/fields'
import { PopupContext } from '../../context/PopupContext'
import ConfirmDeleteCoursePopup from './ConfirmDeleteCoursePopup'
import AddEducationOwnerPopup from './AddEducationOwnerPopup'
import { valueFromAST } from 'graphql'

const MyEducationOverview = (props) => {

  const {strings} = useContext(LanguageContext)
  const {showPopup} = useContext(PopupContext)
  const history = useHistory()
  const { search } = useLocation()
  const {user, organization, allUserOrganizations} = useContext(AuthContext)
  const [loading, setLoading] = useState(true)
  //const category = dummyCategories.find(cat => cat.id === data.categoryID)
  const [courses, setCourses] = useState([])

  const { PaginationControls, getCurrent, ready } = usePagination(ORG_EDUCATIONS, 10, PaginationContext)

  const filters =  {
    draft: fields.record_status.draft, 
    published: fields.record_status.approved, 
    archived: fields.record_status.archived
  }

  useEffect(() => {
    if (!ready) {
      setLoading(true)
      return
    }
    const values = queryString.parse(search)
    if (!values.org) {
      return
    }
    getCurrent({variables: { orgid: parseInt(values.org), record_status: values.filter ? filters[values.filter] : fields.record_status.approved}})
      .then(({ loading, error, data }) => {
        setCourses(data.courses.nodes)
        setLoading(false)
      })
  }, [ready, search])

  useEffect(() => {
    const values = queryString.parse(search)
    history.push({search: '?' + new URLSearchParams({filter: values.filter ? values.filter : 'published', org: values.org ? values.org : organization.id}).toString()})
  }, [search])

  // useEffect(() => {
  //   console.log("orgid", orgId)
  //   if (!orgId) {
  //     history.push({search: '?' + new URLSearchParams({filter: 'published'}).toString()})
  //   }
  // }, [orgId])


  const updateCourses = (data) => {
    setCourses(data.courses.nodes)
  }

  const columns = [
    {content: strings.course.title, class:'sortable', sortField: 'title'},
    {content: strings.overview.lastChanged, class:'sortable', sortField: 'time_modified'},
    {content: '', class: 'last-values'}
  ]

  const generateCourseRow = (course) => {
    return [
      <div><Link to={'/learn/course/' + course.id}><h3 className='test'>{course.title}</h3></Link>{course.import_source!== null ? strings.course.importedFrom + ' ' + course.import_source.replace('_', ' ') : ''}</div>,
      // <p className={rowClass+'text'}>{strings.course.statuses[course.record_status]}</p>,
      <p className='text'>{strings.overview.lastChangedBy(formatDate(course.time_modified), "author")}</p>,
      <div className='buttons'>
        <div><button className='button icon-button icon-only table' onClick={() => history.push('/educate/myeducation/edit/' + course.id)}><EditIcon />{ strings.overview.edit }</button><br/></div>
        <div><button className='button icon-button icon-only table' onClick={() => history.push('/educate/myeducation/add/' + course.id)}><CopyIcon />{ strings.overview.duplicate }</button><br/></div>
        <div><button className='button icon-button icon-only table' onClick={() => showPopup(<AddEducationOwnerPopup course={course} />, 'popup-basic noscroll')}><OwnerIcon/>{ strings.overview.reassign }</button></div>
        <div><button className='button icon-button icon-only table' onClick={() => showPopup(<ConfirmDeleteCoursePopup course={course}/>)}><BinIcon />{ strings.overview.remove }</button></div>
      </div>
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
