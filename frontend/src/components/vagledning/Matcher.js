import React, { useState, useContext, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { LanguageContext } from '../../context/LanguageContext'
import { GuidanceContext } from '../../context/GuidanceContext'
import { CheckboxInput, Form } from '../educate/FormInputs'
import { taxonomyGraphql } from '../../util/arbetsformedlingen'


const Matcher = () => {

  const { strings } = useContext(LanguageContext)
  const { competences, setCompetences } = useContext(GuidanceContext)
  const { occupations, setOccupations } = useContext(GuidanceContext)
  const { occupationGroups, setOccupationGroups } = useContext(GuidanceContext)
  const history = useHistory()
  const [errors, setErrors] = useState({})
  const [formData, setFormData] = useState({})

  const handleCompetenceChange = (event) => {
    const currentIndex = competences.findIndex((competences) => competences.label === event.target.id);
    const updatedCompetence = Object.assign({}, competences[currentIndex]);
    updatedCompetence.vagledning_active = !updatedCompetence.vagledning_active;
    const newCompetences = competences.slice();
    newCompetences[currentIndex] = updatedCompetence;
    setCompetences(newCompetences);
  };

  const handleOccupationChange = (event) => {
    const currentIndex = occupations.findIndex((occupations) => occupations.label === event.target.id);
    const updatedOccupation = Object.assign({}, occupations[currentIndex]);
    updatedOccupation.vagledning_active = !updatedOccupation.vagledning_active;
    const newOccupations = occupations.slice();
    newOccupations[currentIndex] = updatedOccupation;
    setOccupations(newOccupations);
  };

  const handleOccupationGroupChange = (event) => {
    const currentIndex = occupationGroups.findIndex((occupationGroups) => occupationGroups.label === event.target.id);
    const updatedGroup = Object.assign({}, occupationGroups[currentIndex]);
    updatedGroup.vagledning_active = !updatedGroup.vagledning_active;
    const newGroups = occupationGroups.slice();
    newGroups[currentIndex] = updatedGroup;
    setOccupationGroups(newGroups);
    // Get related skills
    const fetchRelatedSkills = async () => {
      const taxData = await taxonomyGraphql("query MyQuery{concepts(id:\"" + event.target.getAttribute('data-tax-id') + "\"){id preferred_label type related(type:\"skill\",limit:50){id type preferred_label}}}", '', '');
      taxData.data.concepts[0].related.forEach(skill => {
        console.log(skill.preferred_label);
      });
    }
    fetchRelatedSkills();
  }

  const PersonTagInput = (tags, changeHandler) => {
    return (
      <div className='cats-wrap'>
        {tags.map((item, index) => (
          <div key={index} className='cat-title'>
            <CheckboxInput id={item.label} data-tax-id={item.concept_taxonomy_id} checked={item.vagledning_active} onChange={changeHandler} text={item.label} />
          </div>
        ))}
      </div>
    )
  }

  const handleSubmit = (evt) => {
    console.log('handleSubmit')
    // To Be Continued ...
    history.push('/vagledning')
  }

  return (
    <div>
      <Form formData={formData} setFormData={setFormData} errors={errors} className='register-user' onSubmit={handleSubmit}>
        <div className='learn-start'>
          <div>
            {strings.vagledning.matching.cvCompetenceMatch}
          </div>
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
        </div>
        <button className='button'>{strings.vagledning.cv.next}</button>
      </Form>
    </div>
  )
}

export default Matcher
