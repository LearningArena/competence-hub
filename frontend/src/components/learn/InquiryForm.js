import React from 'react'
import { useContext } from 'react'
import { LanguageContext } from '../../context/LanguageContext'
import { fields } from '../../data/fields'
import { CheckboxInput, DateInput, DropdownInput, Form, ImageInput, MultiDropdownInput, MultiLineInput, SingleLineInput } from '../educate/FormInputs'

const InquiryForm = ({ formData, setFormData, handleSubmit }) => {

  const { strings } = useContext(LanguageContext)
  const { categoriesList } = fields
  const fieldClass = formData?.target?.value === undefined ? (
    ' disable-all'
  ) : formData.target?.value == '0' ? (
    ' coach'
  ) : (
        ''
      )

  return (
    <Form formData={formData} setFormData={setFormData} onSubmit={handleSubmit} className='add-request'>
      <DropdownInput id='target' text={strings.request.type} placeholder={strings.request.placeholders.type}
        items={[
          { value: fields.inquiryTarget.coaching, text: strings.request.targets[fields.inquiryTarget.coaching] },
          { value: fields.inquiryTarget.education, text: strings.request.targets[fields.inquiryTarget.education] },
        ]}
      />

      <div className={'fields' + fieldClass}>
        <SingleLineInput id='title' text={strings.request.title} placeholder={strings.request.placeholders.title} />
        <MultiLineInput id='description' text={strings.request.description} placeholder={strings.request.placeholders.description} />
        <div className='columns'>
          <div className='column-left'>
            <DropdownInput className='edu-only' id='category' text={strings.request.category} placeholder={strings.request.placeholders.category}
              items={categoriesList.map(cat => ({ value: cat.slug, text: strings.categories[cat.slug] }))} />
          </div>
          <div className='column-right'>
            <SingleLineInput id='location' text={strings.request.place} placeholder={strings.request.placeholders.place} />
          </div>
        </div>
        <div className='columns'>
          <div className='column-left'>
            <div className='column-left-double'>
              <div className='leftone'>
                <DateInput className='edu-only' id='start_date' text={strings.request.start} placeholder={strings.request.placeholders.start} />
              </div>
              <div className='lefttwo'>
                <DateInput className='edu-only' id='end_date' text={strings.request.end} placeholder={strings.request.placeholders.end} />
              </div>
            </div>
          </div>
          <div className='column-right'>
            <DropdownInput className='edu-only' id='studypace' text={strings.request.studyPace} placeholder={strings.request.placeholders.studyPace}
              items={[
                { value: '100%', text: '100%' },
                { value: '50%', text: '50%' },
                { value: '25%', text: '25%' },
              ]}
            />
          </div>
        </div>
        <div className='columns'>
          <div className='column-left'>
            <SingleLineInput id='name_of_contact_person' text={strings.request.contactName} placeholder={strings.request.placeholders.contactName} />
            <SingleLineInput id='email_of_contact_person' text={strings.request.contactMail} placeholder={strings.request.placeholders.contactMail} />
          </div>
          <div className='column-right'>
            <SingleLineInput id='phonenumber_of_contact_person' text={strings.request.contactPhone} placeholder={strings.request.placeholders.contactPhone} />

            {/* <MultiDropdownInput classNamePrefix='dropdown' id='companies' text={'Receiving organisations'} placeholder={'placeholder text...'}
                items={dummyCompanies.map(cat => ({value:cat.title, label: <div className= 'icon-list'><img src={require('../../data/dummy/'+cat.image)} height="30px" width="30px"/><p>{cat.title}</p></div>}))}
                /> */}

          </div>
        </div>
        <div className='columns'>
          {/* <button className='button'>{strings.addEducation.viewpreview}</button> */}
          <div className='status column-left'>
            
            <DropdownInput className='dropdown' id='record_status' text={strings.course.status} placeholder={strings.course.status}
              items={[
                { value: fields.record_status.approved, text: strings.course.statuses[fields.record_status.approved] },
                { value: fields.record_status.archived, text: strings.course.statuses[fields.record_status.archived] },
              ]}
            />
          </div>
          <div className='column-right'>
            <button className='button'>{strings.addEducation.save}</button>
          </div>
        </div>
      </div>
    </Form>
  )
}

export default InquiryForm
