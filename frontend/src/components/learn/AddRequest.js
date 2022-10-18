import { useMutation } from '@apollo/client'
import React from 'react'
import { useEffect } from 'react'
import { useContext } from 'react'
import { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext'
import { LanguageContext } from '../../context/LanguageContext'
import { dummyCompanies } from '../../data/dummy/companies'
import { dummyCategories } from '../../data/dummy/courses'
import { fields } from '../../data/fields'
import { ADD_INQUIRY, INQUIRY_LIST, MY_INQUIRIES } from '../../data/queries'
import { formActions } from '../educate/FormActions'
import { DateInput, DropdownInput, MultiLineInput, SingleLineInput, MultiDropdownInput, Form } from '../educate/FormInputs'
import InquiryForm from './InquiryForm'

const AddRequest = () => {

  const {strings} = useContext(LanguageContext)
  const history = useHistory()
  const {organization} = useContext(AuthContext)
  const [addInquiryGQL, mutationData] = useMutation(ADD_INQUIRY, {refetchQueries: [{query: MY_INQUIRIES}, {query: INQUIRY_LIST}]})
  const multiDropdownFields = ['companies']
  const dropdownFields = ['target', 'category', 'studypace', 'status']
  const integerFields = ['target']
  const dateFields = ['start_date', 'end_date']
  const {categoriesList} = fields
  const [formData, setFormData] = useState({
    record_status: fields.record_status.approved
  })

  useEffect(() => {
    console.log(formData)
  }, [formData])

  const fieldClass = formData.target?.value === undefined ? (
    ' disable-all'
  ) : formData.target?.value == fields.inquiryTarget.coaching ? (
    ' coach'
  ) : (
    ''
  )
  
  const formatData = (formData) => formActions.formatFormData(formData, {
    dropdownFields,integerFields,dateFields
  })

  const handleSubmit = (evt) => {
    evt.preventDefault()
    const formattedData = formatData(formData)
    const dataWithOrgId = {...formattedData, organization_id: organization.id}
    dataWithOrgId.record_status = dataWithOrgId.record_status.value;
    console.log("*-)", dataWithOrgId)
    addInquiryGQL({variables: dataWithOrgId}).then(res => {
      console.log(res)
      history.push('/learn/myrequests/overview')
    })
  }

  return (
    <div className='add-request'>
      <div className='top-container'>
        <p> <strong>{strings.request.addDesc}</strong></p>
      </div>
      <InquiryForm formData={formData} setFormData={setFormData} handleSubmit={handleSubmit} />
    </div>
  )
}

export default AddRequest
