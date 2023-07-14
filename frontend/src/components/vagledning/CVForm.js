import React, { useState, useContext, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { LanguageContext } from '../../context/LanguageContext'
import { GuidanceContext } from '../../context/GuidanceContext'
import { Form, FileInput } from '../educate/FormInputs'
import { jobadEnrichTextDocuments, jobedOccupationsMatchByText, taxonomyGraphql } from '../../util/arbetsformedlingen'


const CVForm = ({ formData, setFormData, submitForm }) => {

  const { strings } = useContext(LanguageContext)
  const { cvText, setCvText } = useContext(GuidanceContext)
  const { cvCompetences, setCvCompetences } = useContext(GuidanceContext)
  const { cvOccupations, setCvOccupations } = useContext(GuidanceContext)
  const { occupations, setOccupations } = useContext(GuidanceContext)
  const { occupationGroups, setOccupationGroups } = useContext(GuidanceContext)
  const { occupationFields, setOccupationFields } = useContext(GuidanceContext)
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
      setCvText(currentCV)

      // Fetch all cv-derived data needed before user gets involved
      const fetchCVEnrichment = async () => {
        let newState = {}

        // First use JobAd API to extract comptences and occupations
        const jobadData = await jobadEnrichTextDocuments('', currentCV);
        newState = jobadData[0].enriched_candidates.competencies.reduce((obj, item) => {
          return {
            ...obj,
            [item.concept_label]: {
                "label": item.concept_label,
                "concept_taxonomy_id": '', //TODO: Ask JobTech why it's missing!
                "term": item.term,
                "prediction": item.prediction,
                "vagledning_active": false // (item.prediction > 0.33 ? true : false)
              },
          }
        }, newState)
        setCvCompetences(newState)
        newState = {}
        newState = jobadData[0].enriched_candidates.occupations.reduce((obj, item) => {
          return {
            ...obj,
            [item.concept_label]: {
                "label": item.concept_label,
                "concept_taxonomy_id": '', //TODO: Ask JobTech why it's missing!
                "term": item.term,
                "prediction": item.prediction,
                "vagledning_active": false // (item.prediction > 0.33 ? true : false)
              },
          }
        }, newState)
        setCvOccupations(newState)

      };
      fetchCVEnrichment();
      history.push('/vagledning/insight')
    }
  }

  
  return (
    <>
      <Form className='add-edu'>
        <FileInput id='cv_file' onChange={handleChange} popupText={strings.vagledning.cv.popup.uploadInstr} text={strings.vagledning.cv.cvInstr} multiple />
        <span className='upload-specifications'>{strings.vagledning.cv.uploadSpec}</span>

        {currentCV && <h3>{strings.vagledning.cv.analyzeText}</h3>}
        {currentCV && <pre>{currentCV}</pre>}

        <label style={{verticalAlign: 'super'}}>
          <input type="checkbox" />
          <span>{strings.vagledning.cv.dataProcessText}</span>
        </label>

        <div style={{textAlign: 'center'}}>
          <button className='button save-button' onClick={handleClick}>{strings.vagledning.cv.next}</button>
        </div>
      </Form>
    </>
  )
}

export default CVForm
