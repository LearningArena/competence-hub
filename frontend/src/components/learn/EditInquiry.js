import { useMutation, useQuery } from '@apollo/client'
import React from 'react'
import { useContext } from 'react'
import { useEffect } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { LanguageContext } from '../../context/LanguageContext'
import { INQUIRY_BY_ID, EDIT_INQUIRY, MY_INQUIRIES, INQUIRY_LIST } from '../../data/queries'
import { formatDate } from '../../util/date'
import { formActions } from '../educate/FormActions'
import AddRequest from './AddRequest'
import InquiryForm from './InquiryForm'

const EditInquiry = ({formData, setFormData}) => {

  const {strings} = useContext(LanguageContext)
  const id = parseInt(useParams().id)
  const dropdownFields = ['target', 'category', 'studypace', 'status']
  const integerFields = ['target']
  const dateFields = ['start_date', 'end_date']
  const history = useHistory()

  const {data} = useQuery(INQUIRY_BY_ID, {variables: {id: id }})
  const [editInquiryGQL, mutationData] = useMutation(EDIT_INQUIRY, {refetchQueries: [{query: MY_INQUIRIES},{query: INQUIRY_LIST}]})

  useEffect(() => {
    if (data) {
      const filteredData = formActions.parseDates(formActions.filterUnused(data.inquiries.nodes[0]), dateFields)
      console.log('data loaded', filteredData)
      //const target = {value: filteredData.target, label: strings.request.targets[filteredData.target]}
      setFormData(prev => ({...filteredData, ...prev}))
    }
    
  }, [data])

  useEffect(() => {
    console.log(formData)
  }, [formData])

  const formatData = (formData) => formActions.formatFormData(formData, {
    dropdownFields,integerFields,dateFields
  })

  const handleSubmit = (evt) => {
    evt.preventDefault()
    formData.record_status = formData.record_status.value;
    formData.status = formData.record_status.value;
    const formattedData = formatData(formData)
    console.log('Submitting', formData)
    editInquiryGQL({variables: formattedData}).then(res => {
      console.log(formattedData)
      setFormData(null)
      history.push('/learn/myrequests/overview')
    }).catch(err => {
      console.log(err)
    })
  }

  if (!formData) return null
  return (
    <div className='add-request edit-request'>
        <div className='top-container'>
          <p><strong>{strings.request.editDesc}</strong></p>
        </div>
    <InquiryForm formData={formData} setFormData={setFormData} handleSubmit={handleSubmit} />
    </div>
  )
}

export default EditInquiry
