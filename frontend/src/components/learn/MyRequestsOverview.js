import React from 'react'
import Table from '../general/Table'
import {ReactComponent as EditIcon} from '../../images/icon-edit.svg'
import {ReactComponent as BinIcon} from '../../images/icon-bin.svg'
import { useQuery } from '@apollo/client'
import { MY_INQUIRIES } from '../../data/queries'
import { formatDate } from '../../util/date'
import { useHistory } from 'react-router-dom'
import { englishStrings } from '../../data/strings/english'
import { useContext } from 'react'
import { LanguageContext } from '../../context/LanguageContext'
import { fields } from '../../data/fields'
import ConfirmDeleteInquiryPopup from './ConfirmDeleteInquiryPopup'
import { PopupContext } from '../../context/PopupContext'

const MyRequestsOverview = () => {

  const {data} = useQuery(MY_INQUIRIES)
  const inquiryItems = data?.inquiries.nodes ?? []
  const activeInquiries = inquiryItems.filter(inquiry => inquiry.record_status !== fields.record_status.archived)
  const archivedInquiries = inquiryItems.filter(inquiry => inquiry.record_status === fields.record_status.archived)
  const history = useHistory()
  const {strings} = useContext(LanguageContext)
  const {showPopup} = useContext(PopupContext)
  const activeColumns = [
    {content: <h4>{strings.request.activeHeader}</h4>, class:'wide'},
    {content: 'Status', class:'sortable'},
    {content: strings.request.startdate, class:'sortable'},
    {content: '', class: 'last-values one'},
    {content: '', class: 'last-values'},
  ]
  const archivedColumns = [
    {content: <h4>{strings.request.archivedHeader}</h4>, class:'wide'},
    {content: 'Status', class:'sortable'},
    {content: strings.request.startdate, class:'sortable'},
    {content: '', class: 'last-values one'},
    {content: '', class: 'last-values'},
  ]

  const makeItem = (inquiry) => [
    <h3>{inquiry.title}</h3>,
    <b>{strings.course.statuses[inquiry.status]}</b>,
    <b>{inquiry.start_date && formatDate(inquiry.start_date)}</b>,
    <button className='button icon-button icon-only table'><EditIcon onClick={() => history.push('/learn/myrequests/edit/' + inquiry.id)} /></button>,
    <button className='button icon-button icon-only table'><BinIcon onClick={() => showPopup(<ConfirmDeleteInquiryPopup inquiry={inquiry} />)} /></button>,
  ]

  return (
    <div className='content overview'>
      <Table className='active-requests' columnInfo={activeColumns} content={activeInquiries.map(makeItem)}/>
      <Table className='archived-requests' columnInfo={archivedColumns} content={archivedInquiries.map(makeItem)}/>
    </div>
  )
}

export default MyRequestsOverview
