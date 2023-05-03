import React, { useState, useContext } from 'react'
import { LanguageContext } from '../../context/LanguageContext'
import ProgressTable from '../general/ProgressTable'
import StepHeader from '../general/StepHeader'
import CVForm from './CVForm'


const CVMain = () => {

  const { strings } = useContext(LanguageContext)
  const [formData, setFormData] = useState()

  const handleSubmit = (evt) => {
    evt.preventDefault()
  }

  return (
    <>
      <div className='vagledning-start'>

        <div style={{position: 'relative', margin: '0 auto', width: '400px', height: '400px'}}>
          <div style={{position: 'absolute', top: '50%', left: '50%', transform: 'translate(-55%, -55%)', width: '400px', height: '400px'}}>
            <svg width="450" height="450" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg" stroke="#000" strokeWidth=".003" fill="white">
              {/* <g stroke-width="0"/> */}
              {/* <g stroke-linecap="round" stroke-linejoin="round" stroke="#CCC" stroke-width=".512"/> */}
              <path d="M232 128c0 12.505-17.82 21.952-22.677 33.69-4.684 11.322 1.42 30.645-7.784 39.85s-28.527 3.099-39.85 7.783C149.952 214.18 140.505 232 127.999 232c-12.504 0-21.951-17.82-33.688-22.677-11.323-4.685-30.646 1.42-39.85-7.784s-3.1-28.527-7.784-39.85C41.82 149.952 24 140.505 24 127.999c0-12.504 17.82-21.951 22.677-33.688 4.685-11.323-1.42-30.646 7.784-39.85s28.527-3.1 39.85-7.784C106.048 41.82 115.495 24 128.001 24c12.504 0 21.951 17.82 33.688 22.677 11.323 4.684 30.646-1.42 39.85 7.784s3.1 28.527 7.784 39.85C214.18 106.048 232 115.495 232 128.001Z" opacity=".9"/>
            </svg>
          </div>
          <div style={{position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '250px', height: '250px', textAlign: 'center'}}>
            <p>{strings.vagledning.cv.bubbleHeader}</p>
            <p>{strings.vagledning.cv.bubbleText1}</p>
            <p>{strings.vagledning.cv.bubbleText2}</p>
          </div>
        </div>

        <h2>{strings.vagledning.cv.pageTitle}</h2>

        <ProgressTable currentStep='1' totalSteps='4' />

        <StepHeader currentStep='1' text={strings.vagledning.cv.step1Header} />

        <CVForm formData={formData} setFormData={setFormData} submitForm={handleSubmit} />
      </div>
    </>
  )
}

export default CVMain
