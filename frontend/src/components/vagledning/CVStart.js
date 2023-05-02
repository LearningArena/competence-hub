import React, { useState, useContext } from 'react'
import { LanguageContext } from '../../context/LanguageContext'
import ProgressTable from '../general/ProgressTable'
import CVForm from './CVForm'


const CVMain = () => {

  const { strings } = useContext(LanguageContext)
  const [formData, setFormData] = useState()

  const handleSubmit = (evt) => {
    evt.preventDefault()
  }

  return (
    <>
      <div className='learn-start'>
        <p>{strings.vagledning.cv.bubbleHeader}</p>
        <p>{strings.vagledning.cv.bubbleText1}</p>
        <p>{strings.vagledning.cv.bubbleText2}</p>

        <h2>{strings.vagledning.cv.pageTitle}</h2>

        <ProgressTable currentStep='1' totalSteps='4' />

        <h3>{strings.vagledning.cv.step1Header}</h3>
        <CVForm formData={formData} setFormData={setFormData} submitForm={handleSubmit} />
      </div>
    </>
  )
}

export default CVMain
