import React, { useState, useContext, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { LanguageContext } from '../../context/LanguageContext'
import { GuidanceContext } from '../../context/GuidanceContext'
import { Form, FileInput } from '../educate/FormInputs'
import { jobadEnrichTextDocuments, jobedOccupationsMatchByText, taxonomyGraphql } from '../../util/arbetsformedlingen'


const CVForm = ({ formData, setFormData, submitForm }) => {

  const { strings } = useContext(LanguageContext)
  const { cvData, setCVData } = useContext(GuidanceContext)
  const { competences, setCompetences } = useContext(GuidanceContext)
  const { occupations, setOccupations } = useContext(GuidanceContext)
  const { occupationGroups, setOccupationGroups } = useContext(GuidanceContext)
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

      // First use JobAd API to extract comptences and traits
      const fetchCVEnrichment = async () => {
        const jobadData = await jobadEnrichTextDocuments('', currentCV);
        console.log(jobadData)
        setCompetences(jobadData[0].enriched_candidates.competencies.map(c => {
              return {
                "label": c.concept_label,
                "concept_taxonomy_id": '', //TODO: Ask JobTech why it's missing!
                "term": c.term,
                "prediction": c.prediction,
                "vagledning_active": true
              }
            }
          )
        )
        // Then use JobEd API to find occupations and occupation groups
        const jobedData = await jobedOccupationsMatchByText(jobadData[0].enriched_candidates.competencies.map(c => c.term).join(' '));
        console.log(jobedData)
        setOccupations(jobedData.related_occupations.map(o => {
              return {
                "label": o.occupation_label,
                "concept_taxonomy_id": o.concept_taxonomy_id,
                "metadata": o.metadata,
                "vagledning_active": true
              }
            }
          )
        )
        setOccupationGroups(jobedData.related_occupations.map(o => {
          return {
            "label": o.occupation_group.occupation_group_label,
            "concept_taxonomy_id": o.occupation_group.concept_taxonomy_id,
            "ssyk": o.occupation_group.ssyk,
            "vagledning_active": true
          }
        }))
        // Then use AF Taxonomy to find related skills from occupation groups
        if (jobedData.related_occupations.length > 0) {
          console.log(jobedData.related_occupations[Math.floor(jobedData.related_occupations.length / 2)].occupation_group);  
          const taxData = await taxonomyGraphql("query MyQuery{concepts(id:\"" + jobedData.related_occupations[Math.floor(jobedData.related_occupations.length / 2)].occupation_group.concept_taxonomy_id + "\"){id preferred_label type related(type:\"skill\",limit:50){id type preferred_label}}}", '', '');
          console.log(taxData)
        }
      };
      fetchCVEnrichment();
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
