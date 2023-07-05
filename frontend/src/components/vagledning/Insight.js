import React, { useState, useContext, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { LanguageContext } from '../../context/LanguageContext'
import { GuidanceContext } from '../../context/GuidanceContext'
import SectionWrapper from './SectionWrapper'
import { CheckboxInput, Form } from '../educate/FormInputs'
import { jobedOccupationsMatchByText, taxonomyGraphql } from '../../util/arbetsformedlingen'


const Insight = () => {

  const { strings } = useContext(LanguageContext)
  const { cvCompetences, setCvCompetences } = useContext(GuidanceContext)
  const { cvOccupations, setCvOccupations } = useContext(GuidanceContext)
  const { skills, setSkills } = useContext(GuidanceContext)
  const { occupations, setOccupations } = useContext(GuidanceContext)
  const { occupationGroups, setOccupationGroups } = useContext(GuidanceContext)
  const { occupationFields, setOccupationFields } = useContext(GuidanceContext)
  const history = useHistory()
  const [errors, setErrors] = useState({})
  const [formData, setFormData] = useState({})
  const [inputChange, setInputChange] = useState(false)

  
  const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay))

  const handleCvCompetenceChange = (event) => {
    console.log('handleCvCompetenceChange')
    const idKey = event.target.id
    const updatedCompetence = Object.assign({}, cvCompetences[idKey]);
    updatedCompetence.vagledning_active = !updatedCompetence.vagledning_active;
    setCvCompetences(prevState => ({
      ...prevState,
      [idKey]: updatedCompetence
    }));
    setInputChange(true)
  };

  const handleCvOccupationChange = (event) => {
    console.log('handleCvOccupationChange')
    const idKey = event.target.id
    const updatedOccupation = Object.assign({}, cvOccupations[idKey]);
    updatedOccupation.vagledning_active = !updatedOccupation.vagledning_active;
    setCvOccupations(prevState => ({
      ...prevState,
      [idKey]: updatedOccupation
    }));
    setInputChange(true)
  };


  // limit update call frequency
  useEffect(() => {
    const timer = setTimeout(() => inputChange && updateJobEdRelated(), 5e3)
    return () => clearTimeout(timer)
  }, [inputChange]);

  const updateJobEdRelated = () => {
    console.log('updateJobEdRelated!')

    // console.log(Object.keys(cvCompetences).map(function (k) {return (cvCompetences[k]['vagledning_active'] ? cvCompetences[k]['term'] : '');}).join(" "));

    const fetchJobEdRelated = async () => {
      // First use JobEd API to find occupations (occupation-name) and occupation groups (ssyk-level-4)
      let newState = {}
      const jobedData = await jobedOccupationsMatchByText(Object.keys(cvCompetences).map(function (k) {return (cvCompetences[k]['vagledning_active'] ? cvCompetences[k]['term'] : '');}).join(' '), 10);
      if (!jobedData.hasOwnProperty("related_occupations")) {
        console.log("Match error: maybe no inputText")
        return
      }
      console.log("jobed res:", jobedData.related_occupations.length)
      newState = jobedData.related_occupations.reduce((obj, item) => {
        return {
          ...obj,
          [item.concept_taxonomy_id]: {
              "label": item.occupation_label,
              "concept_taxonomy_id": item.concept_taxonomy_id,
              "definition": '',
              "metadata": item.metadata,
              "vagledning_active": false //TODO: (item.metadata.match_score > 10 ? true : false)
            },
        }
      }, newState)
      console.log("occs:", Object.keys(newState).length)
      setOccupations(newState)
      newState = {}
      newState = jobedData.related_occupations.reduce((obj, item) => {
        return {
          ...obj,
          [item.occupation_group.concept_taxonomy_id]: {
              "label": item.occupation_group.occupation_group_label,
              "concept_taxonomy_id": item.occupation_group.concept_taxonomy_id,
              "definition": '',
              "ssyk": item.occupation_group.ssyk,
              "vagledning_active": false
            },
        }
      }, newState)
      console.log("groups:", Object.keys(newState).length)
      setOccupationGroups(newState)

      // Then use AF Taxonomy to find occupation fields related to occupations
      newState = {}
      let newData = await taxonomyGraphql("query MyQuery{concepts(id:[" + jobedData.related_occupations.map(o => `"${o.concept_taxonomy_id}"`).join(",") + "]){id preferred_label type related(type:\"occupation-field\",limit:50){id type preferred_label}}}", '', '');
      for (let i = 0; i < newData.data.concepts.length; i++) {
        if (newData.data.concepts[i].related.length > 0) {
          newState = newData.data.concepts[i].related.reduce((obj, f) => {
            return {
              ...obj,
              [f["id"]]: {
                  "label": f.preferred_label,
                  "concept_taxonomy_id": f.id,
                  "vagledning_active": false
                },
            }
          }, newState)
        }
      }
      // ... and occupation fields related to occupation groups
      newData = await taxonomyGraphql("query MyQuery{concepts(id:[" + jobedData.related_occupations.map(o => `"${o.occupation_group.concept_taxonomy_id}"`).join(",") + "]){id preferred_label type related(type:\"occupation-field\",limit:50){id type preferred_label}}}", '', '');
      for (let i = 0; i < newData.data.concepts.length; i++) {
        if (newData.data.concepts[i].related.length > 0) {
          newState = newData.data.concepts[i].related.reduce((obj, item) => {
            return {
              ...obj,
              [item["id"]]: {
                  "label": item.preferred_label,
                  "concept_taxonomy_id": item.id,
                  "vagledning_active": false //TODO: true
                },
            }
          }, newState)
        }
      }
      console.log("fields:", Object.keys(newState).length)
      setOccupationFields(newState)
    };
    fetchJobEdRelated();

    setInputChange(false);
  };

  // update ssyk-level-4 related skills, while keeping previously selected ones
  useEffect(() => {
    // console.log("ssyk change", "groups:", occupationGroups, Object.keys(occupationGroups).length);

    (async () => {
      // Remove previous non-selected skills
      let newState = {... Object.fromEntries(
        Object.entries(skills)
          .filter(([, val]) => val.vagledning_active !== false)
      )}
      let i = 0
      // Add skills related to every occupation group
      for (const ogId in occupationGroups) {
        const taxData = await taxonomyGraphql("query MyQuery{concepts(id:\"" + ogId + "\"){id preferred_label type related(type:\"skill\",limit:5){id type preferred_label}}}", '', '');
        if (taxData.data.concepts.length > 0) {
          console.log("- related " + occupationGroups[ogId].label + ", " + String(taxData.data.concepts.length) + ' more ...');
          newState = taxData.data.concepts[0].related.reduce((obj, item) => {
            return {
              ...obj,
              [item.id]: {
                  "label": item.preferred_label,
                  "concept_taxonomy_id": item.id,
                  "vagledning_active": (skills.hasOwnProperty(item.id) ? skills[item.id].vagledning_active : false)
                },
            }
          }, newState)          
          setSkills(newState)
        }
        await sleep(1000)
      }
      console.log("rel skills:", Object.keys(newState).length);
    })();
  
    return () => {};
  }, [occupationGroups]);
  
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

  const ConceptCheckbox = (tags, changeHandler) => {
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
    history.push('/vagledning/outlook')
  }

  return (
    <div>
      <SectionWrapper>
        <h2 id='heading-mod'>{strings.vagledning.insight.Header}</h2>
        <p>{strings.vagledning.insight.Preamble}</p>
      </SectionWrapper>

      <div className='vagledning-start'>
        <Form formData={formData} setFormData={setFormData} errors={errors} className='register-user' onSubmit={handleSubmit}>
          <div>
            <h3>Extraherade kompetens- och yrkesord</h3>
            (Laborera med val (minst 3) för att upptäcka nya skills)
            {ConceptCheckbox(cvCompetences, handleCvCompetenceChange)}
            <b>- - - - -</b>
            {ConceptCheckbox(cvOccupations, handleCvOccupationChange)}
          </div>
          <hr></hr>
          {/* <div>
            <h3>{strings.vagledning.insight.occupations} från cv-kompetenser (JobEd OccupationsMatchByText)</h3>
            {ConceptCheckbox(occupations, handleOccupationChange)}
          </div>
          <div>
            <h3>{strings.vagledning.insight.occupationGroups} från cv-kompetenser (JobEd OccupationsMatchByText)</h3>
            <p>Klicka för att addera relaterade skills!</p>
            {ConceptCheckbox(occupationGroups, handleOccupationGroupChange)}
          </div> */}
          <div>
            <h3>Skills från {strings.vagledning.insight.occupationGroups} (Taxonomy ssyk-level-4 related skills)</h3>
            {ConceptCheckbox(skills, handleSkillChange)}
          </div>
          {/* <div>
            <h3>{strings.vagledning.insight.occupationFields} från {strings.vagledning.insight.occupationGroups} och {strings.vagledning.insight.occupationNames} (Taxonomy ssyk-level-4,occupation-name related occupation-fields)</h3>
            <ul>
              {Object.entries(occupationFields).map(([key, f], index) => {
                return <li key={index}>{f.label}</li>;
              })}
            </ul>
            {ConceptCheckbox(occupationFields, handleOccupationFieldChange)}
          </div> */}
          <button className='button'>{strings.vagledning.cv.next}</button>
        </Form>
      </div>
    </div>
  )
}

export default Insight
