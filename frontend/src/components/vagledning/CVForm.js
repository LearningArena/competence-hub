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

        // // Then use JobEd API to find occupations (occupation-name) and occupation groups (ssyk-level-4)
        // newState = {}
        // const jobedData = await jobedOccupationsMatchByText(jobadData[0].enriched_candidates.competencies.map(c => c.term).join(' '));
        // newState = jobedData.related_occupations.reduce((obj, item) => {
        //   return {
        //     ...obj,
        //     [item.concept_taxonomy_id]: {
        //         "label": item.occupation_label,
        //         "concept_taxonomy_id": item.concept_taxonomy_id,
        //         "definition": '',
        //         "metadata": item.metadata,
        //         "vagledning_active": false //TODO: (item.metadata.match_score > 10 ? true : false)
        //       },
        //   }
        // }, newState)
        // setOccupations(newState)
        // newState = {}
        // newState = jobedData.related_occupations.reduce((obj, item) => {
        //   return {
        //     ...obj,
        //     [item.occupation_group.concept_taxonomy_id]: {
        //         "label": item.occupation_group.occupation_group_label,
        //         "concept_taxonomy_id": item.occupation_group.concept_taxonomy_id,
        //         "definition": '',
        //         "ssyk": item.occupation_group.ssyk,
        //         "vagledning_active": false //TODO: (item.metadata.match_score > 10 ? true : false)
        //       },
        //   }
        // }, newState)
        // setOccupationGroups(newState)

        // // Then use AF Taxonomy to find related occupation fields from occupations ...
        // newState = {}
        // let newData = await taxonomyGraphql("query MyQuery{concepts(id:[" + jobedData.related_occupations.map(o => `"${o.concept_taxonomy_id}"`).join(",") + "]){id preferred_label type related(type:\"occupation-field\",limit:50){id type preferred_label}}}", '', '');
        // for (let i = 0; i < newData.data.concepts.length; i++) {
        //   if (newData.data.concepts[i].related.length > 0) {
        //     newState = newData.data.concepts[i].related.reduce((obj, f) => {
        //       return {
        //         ...obj,
        //         [f["id"]]: {
        //             "label": f.preferred_label,
        //             "concept_taxonomy_id": f.id,
        //             "vagledning_active": false //TODO: true
        //           },
        //       }
        //     }, newState)
        //   }
        // }
        // // ... and occupation names
        // newData = await taxonomyGraphql("query MyQuery{concepts(id:[" + jobedData.related_occupations.map(o => `"${o.occupation_group.concept_taxonomy_id}"`).join(",") + "]){id preferred_label type related(type:\"occupation-field\",limit:50){id type preferred_label}}}", '', '');
        // for (let i = 0; i < newData.data.concepts.length; i++) {
        //   if (newData.data.concepts[i].related.length > 0) {
        //     newState = newData.data.concepts[i].related.reduce((obj, item) => {
        //       return {
        //         ...obj,
        //         [item["id"]]: {
        //             "label": item.preferred_label,
        //             "concept_taxonomy_id": item.id,
        //             "vagledning_active": false //TODO: true
        //           },
        //       }
        //     }, newState)
        //   }
        // }
        // setOccupationFields(newState)
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
