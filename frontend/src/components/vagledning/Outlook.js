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

  function cleanGroupData(data) {
    const lines = data.split("\n");
    const uniqueValues = new Set();

    for (const line of lines) {
        if (line.trim() === "") continue;  // skip empty lines
        const parts = line.split(" : ");
        if (parts.length === 2) {
            uniqueValues.add(parts[1].trim());
        }
    }

    return Array.from(uniqueValues).join("\n");
  }


    return (
      <div>
        {Object.entries(tags).map(([key, item], index) => {
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
                      <table key={index}>
                          <thead>
                              <tr>
                                  <th>Exempelyrken</th>
                                  <th>Chans till jobb</th>
                                  <th>Läs mer</th>
                              </tr>
                          </thead>
                          <tbody>
                              {Object.values(occupationGroups).map((og) => {
                                  if (item.concept_taxonomy_id === og.occupation_field_id) {
                                      return (
                                          <tr key={og.concept_taxonomy_id /* or some other unique key from og */}>
                                              <td>{og.label}</td>
                                              <td>
                                                  {
                                                      occGroupForecasts[item.concept_taxonomy_id + ":0"] 
                                                      ? occGroupForecasts[item.concept_taxonomy_id + ":0"].shortage
                                                      : 'info saknas'
                                                  }
                                              </td>
                                              <td>länk</td>
                                          </tr>
                                      );
                                  }
                                  return null;  // Return null for items that don't meet the condition
                              })}
                          </tbody>
                      </table>
                    </div>
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
