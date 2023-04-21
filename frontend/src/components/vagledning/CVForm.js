import React, { useState, useContext } from 'react'
import { useHistory } from 'react-router-dom'
import { LanguageContext } from '../../context/LanguageContext'
import { CVContext } from '../../context/CVContext'
import { Form, FileInput } from '../educate/FormInputs'


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
      setCVData({
                  cvText: currentCV,
                  cvFiles: [],
                  cvCompetences: [],
                  cvOccupations: [],
                  cvTraits: []
                })

      // API call to enrich currentCV string and populate cvData
      fetch("https://jobad-enrichments-api.jobtechdev.se/enrichtextdocuments", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          "documents_input": [
            {
              "doc_id": "123ABC",
              "doc_headline": "",
              "doc_text": currentCV,
            }
          ],
          "include_terms_info": false,
          "include_sentences": false,
          "sort_by_prediction_score": "NOT_SORTED"
        }),
        redirect: 'follow'
      }).then(response => response.json())
        .then(data => {
          setCVData({
            cvCompetences: data[0].enriched_candidates.competencies.map(c => c.term),
            cvOccupations: data[0].enriched_candidates.occupations.map(c => c.term),
            cvTraits:      data[0].enriched_candidates.traits.map(c => c.term)
          })
        })
        .then(console.log('cvData set'))
        .catch(error => console.log('error', error));
      history.push('/vagledning/competence')
    }
  }


  return (
    <>
      <Form className='add-edu'>
        <h2>{strings.vagledning.cv.pageTitle}</h2>
        <h3>{strings.vagledning.cv.about}</h3>
        <p>{strings.vagledning.cv.aboutText}</p>

        <FileInput id='cv_file' onChange={handleChange} popupText={strings.vagledning.cv.popup.cvFile} text={strings.vagledning.cv.cvFile} multiple />
        <span className='upload-specifications'>{strings.vagledning.cv.uploadSpec}</span>

        {currentCV && <h3>{strings.vagledning.cv.analyzeText}</h3>}
        {currentCV && <pre>{currentCV}</pre>}

        <span className='upload-specifications'>{strings.vagledning.cv.dataProcessText}</span>
        <button className='button save-button' onClick={handleClick}>{strings.vagledning.cv.next}</button>
      </Form>
    </>
  )
}

export default CVForm
