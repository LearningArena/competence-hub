import React, { useState, useContext } from 'react'
import { useHistory } from 'react-router-dom'
import { LanguageContext } from '../../context/LanguageContext'
import { Form, FileInput } from '../educate/FormInputs'
import { CVContext } from '../../context/CVContext'


const CVForm = ({ formData, setFormData, submitForm }) => {

  const { strings } = useContext(LanguageContext)
  const { cvData, setCVData } = useContext(CVContext)
  const [currentCV, setCurrentCV] = useState('')
  const history = useHistory()

  const handleChange = (e) => {
    const inputFiles = Array.from(e.target.files)
    var content = currentCV
    inputFiles.forEach((element => {
      var reader = new FileReader()
      reader.onload = function (event) {
        content += event.target.result
        setCurrentCV(content)
      }
      reader.readAsText(element)
    }))
  }

  const handleClick = (e) => {
    if (currentCV) {
      setCVData({ cvText: currentCV,
                  cvFiles: [],
                  cvCompetence: []})
      // API call to enrich currentCV string and populate cvCompetence
      history.push('/vagledning/competence')
    }
  }


  return (
    <>
      <Form className='add-edu'>
        <h2>{strings.cv.pageTitle}</h2>
        <h3>{strings.cv.about}</h3>
        <p>{strings.cv.aboutText}</p>

        <FileInput id='cv_file' onChange={handleChange} popupText={strings.cv.popup.cvFile} text={strings.cv.cvFile} multiple />
        <span className='upload-specifications'>{strings.cv.uploadSpec}</span>

        {currentCV && <h3>{strings.cv.analyzeText}</h3>}
        {currentCV && <pre>{currentCV}</pre>}

        <span className='upload-specifications'>{strings.cv.dataProcessText}</span>
        <button className='button save-button' onClick={handleClick}>{strings.cv.next}</button>
      </Form>
    </>
  )
}

export default CVForm
