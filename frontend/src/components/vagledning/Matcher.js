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
  const { skills, setSkills } = useContext(GuidanceContext)
  const { occupations, setOccupations } = useContext(GuidanceContext)
  const { occupationGroups, setOccupationGroups } = useContext(GuidanceContext)
  const { occupationFields, setOccupationFields } = useContext(GuidanceContext)
  const history = useHistory()
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

  const handleSkillChange = (event) => {
    const idKey = event.target.getAttribute('data-tax-id')
    const updatedSkill = Object.assign({}, skills[idKey]);
    updatedSkill.vagledning_active = !updatedSkill.vagledning_active;
    setSkills(prevState => ({
      ...prevState,
      [idKey]: updatedSkill
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
      let newState = {... skills}
      const taxData = await taxonomyGraphql("query MyQuery{concepts(id:\"" + event.target.getAttribute('data-tax-id') + "\"){id preferred_label type related(type:\"skill\",limit:50){id type preferred_label}}}", '', '');
      newState = taxData.data.concepts[0].related.reduce((obj, item) => {
        return {
          ...obj,
          [item.id]: {
              "label": item.preferred_label,
              "concept_taxonomy_id": item.id,
              "vagledning_active": false
            },
        }
      }, newState)
      setSkills(newState)
    }
    fetchRelatedSkills();
  }

  const handleOccupationFieldChange = (event) => {
    const idKey = event.target.getAttribute('data-tax-id')
    const updatedField = Object.assign({}, occupationFields[idKey]);
    updatedField.vagledning_active = !updatedField.vagledning_active;
    setOccupationFields(prevState => ({
      ...prevState,
      [idKey]: updatedField
    }));
  };

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
            <p>Klicka för att addera relaterade skills!</p>
            {PersonTagInput(occupationGroups, handleOccupationGroupChange)}
          </div>
          <div>
            <h3>Skills från {strings.vagledning.matching.occupationGroups} (Taxonomy ssyk-level-4 related skills)</h3>
            {PersonTagInput(skills, handleSkillChange)}
          </div>
          <div>
            <h3>{strings.vagledning.matching.occupationFields} från {strings.vagledning.matching.occupationGroups} och {strings.vagledning.matching.occupationNames} (Taxonomy ssyk-level-4,occupation-name related occupation-fields)</h3>
            {/* <ul>
              {Object.entries(occupationFields).map(([key, f], index) => {
                return <li key={index}>{f.label}</li>;
              })}
            </ul> */}
            {PersonTagInput(occupationFields, handleOccupationFieldChange)}
          </div>
          <button className='button'>{strings.vagledning.cv.next}</button>
        </Form>
      </div>
    </div>
  )
}

export default Matcher
