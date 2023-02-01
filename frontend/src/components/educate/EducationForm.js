import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { useContext } from 'react'
import { LanguageContext } from '../../context/LanguageContext'
import { formActions } from './FormActions'
import {allEducationFields} from '../../data/queries'
import { dummyCategories } from '../../data/dummy/courses'
import { CheckboxInput, DateInput, DropdownInput, Form, ImageInput, MultiDropdownInput, MultiLineInput, SingleLineInput } from './FormInputs'
import { fields } from '../../data/fields'
import StickyFormButtons from './StickyFormButtons'
import { PopupContext } from '../../context/PopupContext'
import CourseInformation from '../learn/CourseInformation'
import { AuthContext } from '../../context/AuthContext'
import { getCategoryString } from '../../util/category'
import { parseMultiValue } from '../../util/input'
import {
  BrowserView,
  MobileView,
  MobileOnlyView,
  isBrowser,
  isMobile,
  isMobileOnly
} from "react-device-detect"

const EducationForm = ({jsonData, formData, setFormData, submitForm}) => {

  const {strings} = useContext(LanguageContext)
  const {showPopup} = useContext(PopupContext)
  const {organization} = useContext(AuthContext)
  const integerFields = ['online', 'level', 'yrkeshogskolepoang', 'hours', 'price', 'seqf']
  const floatFields = ['credits']
  const dateFields = ['start_date', 'end_date', 'registration_end_date']
  const dropdownFields = ['level', 'seqf', 'studypace', 'online', 'frequensType', 'record_status']
  const multiDropdownFields = ['category', 'language']
  const {categoriesList} = fields

  const initValues = jsonData ? jsonData : Object.fromEntries(
    allEducationFields.split('\n')
    .filter(item => item.length > 0)
    .filter(item => !dateFields.includes(item))
    .map(item => [item, [...dropdownFields, ...multiDropdownFields].includes(item) ? null : ''])
  )

  const initForm = () => {
      setFormData({
        ...initValues, 
      education_provider: organization?.name,
      image_provider: organization?.image_logo,
      record_status: {value: fields.record_status.draft, label: strings.course.statuses[fields.record_status.draft]}
      })
    }

  useEffect(() => {
    if (!formData) {
      initForm()
    }
  }, [])

  useEffect(() => {
    setFormData(prevData => ({
      ...prevData,
      education_provider: organization?.name,
      image_provider: organization?.image_logo
    }))
  }, [organization])

  useEffect(() => {
    if (jsonData) {
      setFormData(jsonData)
    }
  }, [jsonData])


  
  let fieldClass = ''
  if (formData) {
    fieldClass = formData.frequensType === '-1' ? (
      ' disable-all'
    ) : formData.frequensType === '0' ? (
      ' datum'
    ) : formData.frequensType === '1' ? (
      ' other'
    ) : (
      ''
    )
  }

  let importDisabled = false
  if (formData) {
    importDisabled = (formData.import_source === undefined || formData.import_source === '') ? (false) : (true)
  }
  const ImportWarning = () => {
    if (formData.import_source === undefined || formData.import_source === '')
      return null
    else
      return (<span>{ strings.course.maindetailsImportWarning }</span>)
  }

  // const [menuPlace, setMenuPlace] = useState('bottom')

  let menuPlace = "top";

  if(isMobile) {
    menuPlace = "top"
  } else {
    menuPlace = "bottom"
  }

  const joinLanguages = (obj) => obj

  const formatData = (formData) => joinLanguages(formActions.formatFormData(formData, {
    dropdownFields,integerFields,dateFields,multiDropdownFields,floatFields
  }))

  useEffect(() => console.log(formData, parseMultiValue(strings.categories, formatData(formData)?.category)), [formData])

  const showPreview = (evt) => {
    evt.preventDefault()
    const filteredFormData = formatData(formData)
    showPopup(
      <div style={{width: '40em'}}>
        <CourseInformation courseInfo={filteredFormData} />
      </div>
    , '')
  }

  const handleSubmit = (evt) => {
    evt.preventDefault()
    const filteredFormData = formatData(formData)
    submitForm(filteredFormData)
    initForm()
  }

  if (!formData)
    return null
  else
    return (
    <>
    <Form className='add-edu add-education' formData={formData} setFormData={setFormData} onSubmit={handleSubmit}>
    <StickyFormButtons>
      <button className="button" onClick={showPreview} ><h3>{strings.addEducation.viewpreview}</h3></button>
      <div className='status'>
        <h4>status</h4>
        <DropdownInput className='dropdown' id='record_status' menuPlacement={menuPlace} placeholder={strings.course.status}
          items={[
            {value:fields.record_status.draft, text:strings.course.statuses[fields.record_status.draft]},
            {value:fields.record_status.approved, text:strings.course.statuses[fields.record_status.approved]},
            {value:fields.record_status.archived, text:strings.course.statuses[fields.record_status.archived]},
          ]} 
        />
      </div>
      <button className="button" onClick={handleSubmit}><h3>{strings.addEducation.save}</h3></button>
    </StickyFormButtons>
    <div className='form-margin'>
      <h4>{strings.course.maindetailsHeader}</h4>
      <ImportWarning/>
      <div className='columns'>
        <div className='column-left'>
          <SingleLineInput id='title' disabled={importDisabled} limit={50} popupText={strings.course.popup.title} text={strings.course.title} placeholder={strings.placeholders.title}/>
          <SingleLineInput id='education_provider' disabled={importDisabled} popupText={strings.course.popup.provider} text={strings.course.provider} placeholder={strings.placeholders.provider}/>
        </div>
        <div className='column-right'>
          <SingleLineInput id='link' disabled={importDisabled} popupText={strings.course.popup.link} text={strings.course.url} placeholder={strings.placeholders.url}/>
          <div>
            <label>{strings.course.providerLogo}</label>
            <img src={formData?.image_provider}/>
          </div>
        </div> 
      </div>
      <MultiLineInput id='subtitle' disabled={importDisabled} limit={200} popupText={strings.course.popup.subtitle}text={strings.course.summary} placeholder={strings.placeholders.summary} />
      <h4>{strings.course.contentHeader}</h4> 
      <MultiLineInput id='description' disabled={importDisabled} limit={700} popupText={strings.course.popup.description} text={strings.course.description} placeholder={strings.placeholders.description}/>
      <div className='columns'>
        <div className='column-left'>
          <SingleLineInput id='required_tools' disabled={importDisabled} popupText={strings.course.popup.tools} text={strings.course.tools} placeholder={strings.placeholders.tools}/>
          <SingleLineInput id='prerequisite' disabled={importDisabled} popupText={strings.course.popup.prerequisites} text={strings.course.prerequisites} placeholder={strings.placeholders.prerequisite}/>
        </div>
        <div className='column-right'>
          <SingleLineInput id='literature' disabled={importDisabled} popupText={strings.course.popup.literature} text={strings.course.literature} placeholder={strings.placeholders.literature}/>
          <SingleLineInput id='verbs' disabled={importDisabled} popupText={strings.course.popup.verbs} text={strings.course.verbs} placeholder={strings.placeholders.verbs}/>
        </div>
      </div>   

      <div className='columns'>
        <div className='column-left'>
          <h5>{strings.course.scopeHeader}</h5>
          <SingleLineInput id='credits' disabled={importDisabled} popupText={strings.course.popup.credits} text={strings.course.credits} placeholder={strings.placeholders.credits}/>
          <SingleLineInput id='yrkeshogskolepoang' disabled={importDisabled} popupText={strings.course.popup.creditsprof} text={strings.course.creditsprof} placeholder={strings.placeholders.creditsprof}/>
          <SingleLineInput id='hours' disabled={importDisabled} popupText={strings.course.popup.hours} text={strings.course.hours} placeholder={strings.placeholders.hours}/>
        </div>
        <div className='column-right'>
          <h5>{strings.course.levelHeader}</h5> 
          <DropdownInput id='level' disabled={importDisabled} popupText={strings.course.popup.level} text={strings.course.level} placeholder={strings.course.chooseLevel}
            items={[
              {value:"0", text:strings.course.levels.basic},
              {value:"1", text:strings.course.levels.medium},
              {value:"2", text:strings.course.levels.advanced},
            ]} 
          />
          <DropdownInput id='seqf' disabled={importDisabled} popupText={strings.course.popup.seqf} text={strings.course.seqf} placeholder={strings.course.chooseSeqf}
            items={[
              {value:"1", text:strings.course.seqfList.one},
              {value:"2", text:strings.course.seqfList.two},
              {value:"3", text:strings.course.seqfList.three},
              {value:"4", text:strings.course.seqfList.four},
              {value:"5", text:strings.course.seqfList.five},
              {value:"6", text:strings.course.seqfList.six},
              {value:"7", text:strings.course.seqfList.seven},
            ]} 
          />
        </div>
      </div>
      <div className='columns'>
        <div className='column-left'>
        <h5>{strings.course.datefreq}</h5>
          {/* <DropdownInput id='frequensType' text={strings.course.frequensType} placeholder={strings.placeholders.frequensType}
            items={[
              {value:'0', text:strings.course.frequensItems.date},
              {value:'1', text:strings.course.frequensItems.other},
            ]} 
          />
          <SingleLineInput className={'revert' + fieldClass} id='otherFrequensType' text={strings.course.otherFrequensType} placeholder={strings.placeholders.otherFrequensType}/> */}
          <div className='column-left-double'>
            <div className={'leftone' + fieldClass}>
              <DateInput id='start_date' disabled={importDisabled} popupText={strings.course.popup.start} text={strings.course.start}/>
            </div>
            <div className={'lefttwo' + fieldClass}>
              <DateInput id='end_date' disabled={importDisabled} popupText={strings.course.popup.end} text={strings.course.end}/>
            </div>
          </div>
          <DateInput id='registration_end_date' disabled={importDisabled} popupText={strings.course.popup.registerDate} text={strings.course.registerDate}/>
        </div>
        <div className='column-right'>
        <h5>{strings.course.formatHeader}</h5> 
          <DropdownInput id='studypace' disabled={importDisabled} popupText={strings.course.popup.pace} text={strings.course.pace} placeholder={strings.course.choosePace}
            items={[
              {value:'100%', text:'100%'},
              {value:'50%', text:'50%'},
              {value:'25%', text:'25%'},
              {value:'10%', text:'10%'},
              {value:'other', text:strings.course.other},
            ]}
          />
          <DropdownInput id='online' disabled={importDisabled} popupText={strings.course.popup.format} text={strings.course.format} placeholder={strings.course.chooseFormat}
            items={[
              {value:"0", text:strings.course.formats.onlocation},
              {value:"1", text:strings.course.formats.distance},
              {value:"2", text:strings.course.formats.eveningcourse},
              {value:"3", text:strings.course.formats.singleday},
              {value:"4", text:strings.course.formats.halfday},
              {value:"5", text:strings.course.formats.weekend},
              {value:"6", text:strings.course.formats.other},
            ]} 
          />
        </div>
      </div>
      <h4>{strings.course.detailHeader}</h4>
      <div className='columns'>
        <div className='column-left'>
          <MultiDropdownInput classNamePrefix='dropdown' id='category' disabled={importDisabled} popupText={strings.course.popup.category} text={strings.course.category} placeholder={strings.course.chooseCategory}
            items={categoriesList.map(cat => ({value:cat.slug, label:strings.categories[cat.slug]}))}
          />
          <SingleLineInput id='diplomas' disabled={importDisabled} popupText={strings.course.popup.certificates}  text={strings.course.certificates} placeholder={strings.placeholders.certificates}/>
          <SingleLineInput id='teachers' disabled={importDisabled} popupText={strings.course.popup.teacher} text={strings.course.teacher} placeholder={strings.placeholders.teacher}/>
        </div>
        <div className='column-right'>
          <SingleLineInput id='price' disabled={importDisabled} popupText={strings.course.popup.price} text={strings.course.price} placeholder={strings.placeholders.price}/><span className="currency">SEK</span>
          <MultiDropdownInput classNamePrefix='dropdown' id='language' disabled={importDisabled} text={strings.course.language} placeholder={strings.course.chooseCategory}
            items={[
              {value: fields.languages.swedish.slug, label: strings.course.languageList[fields.languages.swedish.id]},
              {value: fields.languages.english.slug, label: strings.course.languageList[fields.languages.english.id]},
            ]}
          />
          <SingleLineInput id='city' disabled={importDisabled} popupText={strings.course.popup.city} text={strings.course.city} placeholder={strings.placeholders.city}/>
        </div>
      </div>
      <MultiLineInput id='bioteachers' disabled={importDisabled} popupText={strings.course.popup.teacherBio}  text={strings.course.teacherBio} placeholder={strings.placeholders.teacherBio}/>
      <ImageInput id='image_feature' disabled={importDisabled} popupText={strings.course.popup.featureImage} text={strings.course.featureImage}/>
      <span className= 'upload-specifications'>Supported file formats: JPG, JPEG, PNG. Minimum recommended resolution 600x400.</span>

      <h4>{strings.course.contactHeader}</h4>
      <div className='columns'>
        <div className='column-left'>
          <SingleLineInput id='name_of_contact_person' disabled={importDisabled} popupText={strings.course.popup.contactPerson} text={strings.course.contactPerson} placeholder={strings.placeholders.contactPerson}/>
        </div>
        <div className='column-right'>
          <SingleLineInput id='email_of_contact_person' disabled={importDisabled} popupText={strings.course.popup.contactEmail} text={strings.course.contactEmail} placeholder={strings.placeholders.contactEmail}/>
        </div>
      </div>
      <div className='columns'>
        <button className='button save-button'>{strings.course.save}</button>
      </div>
    </div>
    </Form>
    </>
  )
}

export default EducationForm
