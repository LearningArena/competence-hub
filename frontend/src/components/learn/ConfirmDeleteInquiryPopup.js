import { useMutation } from '@apollo/client'
import React from 'react'
import { useContext } from 'react'
import { LanguageContext } from '../../context/LanguageContext'
import { PopupContext } from '../../context/PopupContext'
import { fields } from '../../data/fields'
import { INQUIRY_DELETE, MY_INQUIRIES, EDIT_INQUIRY } from '../../data/queries'

const ConfirmDeleteInquiryPopup = ({inquiry}) => {

  const {strings} = useContext(LanguageContext)
  const {hidePopup} = useContext(PopupContext)

  console.log(inquiry)

  const [deleteInquiryGQL, deletemutationData] = useMutation(INQUIRY_DELETE, {refetchQueries: [{query: MY_INQUIRIES}]})
  const [archiveInquiryGQL, archivemutationData] = useMutation(EDIT_INQUIRY, {refetchQueries: [{query: MY_INQUIRIES}]})

  const handleDeleteClick = (evt) => {
    deleteInquiryGQL({variables: {id: inquiry.id}}).then(res => {
      console.log(res)
      hidePopup()
    }).catch(err => {
      console.log(err, inquiry.id)
    }) 
  }

  const handleArchiveClick = (evt) => {
    archiveInquiryGQL({variables: {id: inquiry.id, record_status: fields.record_status.archived}}).then(res => {
      console.log(res)
      hidePopup()
    }).catch(err => {
      console.log(err, inquiry.id)
    }) 
  }

  const handleCancelClick = (evt) => {
    hidePopup()
  }

  return (
    <div className='confirm-delete-course-popup'>
      <div className='title'>
        <h4>{strings.request.deletePopup.title}{inquiry.title}?</h4>
        <p>{strings.request.deletePopup.message}</p>
      </div>
      <div className= 'button-box'>
        <button onClick={handleCancelClick} className='button button-b'>{strings.request.deletePopup.button.cancel}</button> 
        <button onClick={handleArchiveClick} className='button'>{strings.request.deletePopup.button.archive}</button>
        <button onClick={handleDeleteClick} className='button'>{strings.request.deletePopup.button.remove}</button>
      </div>
    </div>
  )
}

export default ConfirmDeleteInquiryPopup
