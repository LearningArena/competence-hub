import React, { useState, useContext } from 'react'
import { useHistory } from 'react-router-dom'
import { LanguageContext } from '../../context/LanguageContext'
import { GuidanceContext } from '../../context/GuidanceContext'
import ProgressTable from '../general/ProgressTable'
import StepHeader from '../general/StepHeader'
import { CheckboxInput, Form } from '../educate/FormInputs'
import { taxonomyGraphql } from '../../util/arbetsformedlingen'


const Matcher = () => {

  const { strings } = useContext(LanguageContext)
  const { competences, setCompetences } = useContext(GuidanceContext)
  const { occupations, setOccupations } = useContext(GuidanceContext)
  const { occupationGroups, setOccupationGroups } = useContext(GuidanceContext)
  const { occupationFields } = useContext(GuidanceContext)
  const history = useHistory()
  const [oGroupSkills, setOGroupSkills] = useState([])
  const [errors, setErrors] = useState({})
  const [formData, setFormData] = useState({})

  const handleCompetenceChange = (event) => {
    const idKey = event.target.id
    const updatedCompetence = Object.assign({}, competences[idKey]);
    updatedCompetence.vagledning_active = !updatedCompetence.vagledning_active;
    setCompetences(prevState => ({
      ...prevState,
      [idKey]: updatedCompetence
    }));
  };

  const handleOccupationChange = (event) => {
    const idKey = event.target.getAttribute('data-tax-id')
    const updatedOccupation = Object.assign({}, occupations[idKey]);
    updatedOccupation.vagledning_active = !updatedOccupation.vagledning_active;
    setOccupations(prevState => ({
      ...prevState,
      [idKey]: updatedOccupation
    }));
  };

  const handleOccupationGroupChange = (event) => {
    const idKey = event.target.getAttribute('data-tax-id')
    const updatedGroup = Object.assign({}, occupationGroups[idKey]);
    updatedGroup.vagledning_active = !updatedGroup.vagledning_active;
    setOccupationGroups(prevState => ({
      ...prevState,
      [idKey]: updatedGroup
    }))
    // Get related skills
    const fetchRelatedSkills = async () => {
      console.log("query MyQuery{concepts(id:\"" + event.target.getAttribute('data-tax-id') + "\"){id preferred_label type related(type:\"skill\",limit:50){id type preferred_label}}}")
      const taxData = await taxonomyGraphql("query MyQuery{concepts(id:\"" + event.target.getAttribute('data-tax-id') + "\"){id preferred_label type related(type:\"skill\",limit:50){id type preferred_label}}}", '', '');
      setOGroupSkills(taxData.data.concepts[0].related.map(s => {
            return {
              "label": s.preferred_label,
              "concept_taxonomy_id": s.id,
              "vagledning_active": false
            }
          }
        )
      )
    }
    fetchRelatedSkills();
  }

  const PersonTagInput = (tags, changeHandler) => {
    return (
      <div className='cats-wrap'>
        {Object.entries(tags).map(([key, item], index) => {
          return  <div key={index} className='cat-title'>
                    <CheckboxInput id={item.label} data-tax-id={item.concept_taxonomy_id} checked={item.vagledning_active} onChange={changeHandler} text={item.label} />
                  </div>
        })}
      </div>
    )
  }

  const handleSubmit = async (evt) => {
    console.log('handleSubmit processing?')
    history.push('/vagledning/matchresult')
  }

  return (
    <div>
      <h2>{strings.vagledning.cv.pageTitle}</h2>

      <ProgressTable currentStep='2' totalSteps='4' />

      <div className='vagledning-start'>
        <StepHeader currentStep='2' text={strings.vagledning.matching.step2Header} />
        <div>
          {strings.vagledning.matching.step2Instr}
        </div>

        <Form formData={formData} setFormData={setFormData} errors={errors} className='register-user' onSubmit={handleSubmit}>
          {/* <div>
            <h3>{strings.vagledning.matching.competences}</h3>
            {PersonTagInput(cvData.cvCompetences)}
          </div>
          <div>
            <h3>{strings.vagledning.matching.traits}</h3>
            {PersonTagInput(cvData.cvTraits)}
          </div> */}
          <div>
            <h3>{strings.vagledning.matching.competences} från cv-text (JobAd EnrichTextDocuments)</h3>
            {PersonTagInput(competences, handleCompetenceChange)}
          </div>
          <div>
            <h3>{strings.vagledning.matching.occupations} från cv-kompetenser (JobEd OccupationsMatchByText)</h3>
            {PersonTagInput(occupations, handleOccupationChange)}
          </div>
          <div>
            <h3>{strings.vagledning.matching.occupationGroups} från cv-kompetenser (JobEd OccupationsMatchByText)</h3>
            {PersonTagInput(occupationGroups, handleOccupationGroupChange)}
          </div>
          <div>
            <h3>{strings.vagledning.matching.competences} från {strings.vagledning.matching.occupationGroups} (Taxonomy ssyk-level-4 related skills)</h3>
            <ul>
              {oGroupSkills.map((skill, index) => {
                return <li key={index}>{skill.label}</li>;
              })}
            </ul>
          </div>
          <div>
            <h3>{strings.vagledning.matching.occupationFields} från {strings.vagledning.matching.occupationGroups} och {strings.vagledning.matching.occupationNames} (Taxonomy ssyk-level-4,occupation-name related occupation-fields)</h3>
            <ul>
              {Object.entries(occupationFields).map(([key, f], index) => {
                return <li key={index}>{f.label}</li>;
              })}
            </ul>
          </div>
          <button className='button'>{strings.vagledning.cv.next}</button>
        </Form>
      </div>
    </div>
  )
}

export default Matcher
