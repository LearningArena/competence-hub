import React, { useState, useContext, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { LanguageContext } from '../../context/LanguageContext'
import { GuidanceContext } from '../../context/GuidanceContext'
import { CheckboxInput, Form } from '../educate/FormInputs'


const Outlook = () => {

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
  const { occGroupForecasts } = useContext(GuidanceContext)


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
    const [showMore, setShowMore] = useState({});
    const handleShowMoreChange = (index) => {
      setShowMore(prevState => ({
          ...prevState,
          [index]: !prevState[index]
      }));
  }
    return (
      <div>
        {Object.entries(tags).map(([key, item], index) => {
          let groups = "";
          for (const ogId in occupationGroups) {
            if (item.concept_taxonomy_id == occupationGroups[ogId].occupation_field_id) {
              // console.log(occupationGroups[ogId].concept_taxonomy_id, occupationGroups[ogId].label);
              groups = groups + "<div key=" + occupationGroups[ogId].concept_taxonomy_id + ">" + occupationGroups[ogId].concept_taxonomy_id + " : " + occupationGroups[ogId].label + "</div>"
              groups = groups + occupationGroups[ogId].concept_taxonomy_id + " : " + occupationGroups[ogId].label + "<br>"
            }
          }
          return  <div key={`wrap-${index}`} className='field-wrap'>
                   <div 
                      key={`inner-1-${index}`} 
                      className={`field-inner-1`}
                      style={{ borderBottomLeftRadius: showMore[index] ? '0px' : '8px' }}>
                    {item.label}
                    <div style={{textAlign: 'center'}}>
                      <p className='field-text'>
                        Här kommer en text om yrkesområdet som beskriver det.
                      </p>
                    <button 
                      className='button' 
                      type="button" 
                      onClick={() => handleShowMoreChange(index)}>
                        {showMore[index] ? 'Visa mindre' : 'Visa mer'}
                    </button>
                    </div>
                    </div>
                    <div key={`inner-2-${index}`} className={`field-inner-2 ${item.vagledning_active ? 'checked' : ''}`} style={{ borderBottomRightRadius: showMore[index] ? '0px' : '8px' }}>
                      För mig känns området:
                      <CheckboxInput id={item.label} data-tax-id={item.concept_taxonomy_id} checked={item.vagledning_active} onChange={changeHandler} text='Intressant' />
                    </div>
                    <div key={`inner-3-${index}`} className={`field-inner-3`} style={{ display: showMore[index] ? 'block' : 'none' }}>
                      <div dangerouslySetInnerHTML={{ __html: groups }} />
                    </div>
                      {/* <CheckboxInput id={item.label} data-tax-id={item.concept_taxonomy_id} checked={item.vagledning_active} onChange={changeHandler} text={item.label} /> */}
                      {/* <div>{occGroupForecasts[item.concept_taxonomy_id+":0"] ? "Forecast year 0: "+occGroupForecasts[item.concept_taxonomy_id+":0"]['shortage'] : "-"}</div> */}
                      {/* <div>{occGroupForecasts[item.concept_taxonomy_id+":3"] ? "Forecast year 3: "+occGroupForecasts[item.concept_taxonomy_id+":3"]['shortage'] : "-"}</div> */}
                  </div>
        })}
      </div>
    )
  }

  const handleSubmit = async (evt) => {
    console.log('handleSubmit processing?')
    history.push('/vagledning/future')
  }

  return (
    <div>
      <div className='content'>
        <h2 id='heading-mod'>{strings.vagledning.outlook.Header}</h2>
        <p dangerouslySetInnerHTML={{__html: strings.vagledning.outlook.Preamble}} />
      </div>

      <div className='vagledning-start'>
        <Form formData={formData} setFormData={setFormData} errors={errors} className='no-margin-form' onSubmit={handleSubmit}>
         
          <div>
            {ConceptCheckbox(occupationFields, handleOccupationFieldChange)}
          </div>
          <div style={{textAlign: 'center'}}>
            <button className='button'>{strings.vagledning.cv.next}</button>
          </div>
        </Form>
      </div>
    </div>
  )
}

export default Outlook
