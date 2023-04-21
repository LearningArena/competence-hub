import React, { useState, useContext, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { LanguageContext } from '../../context/LanguageContext'
import { CVContext } from '../../context/CVContext'
import { CheckboxInput, Form } from '../educate/FormInputs'


const Competence = () => {

  const { strings } = useContext(LanguageContext)
  const { cvData } = useContext(CVContext)
  const history = useHistory()
  const [currentCompetences, setCurrentCompetences] = useState([])
  const [errors, setErrors] = useState({})
  const [formData, setFormData] = useState({})

  useEffect(() => {
    if (cvData.cvCompetences) {
      setCurrentCompetences(cvData.cvCompetences)
    }
  }, [cvData])

  const PersonTagInput = (tags) => {
    return (
      <div className='cats-wrap'>
        {tags.map((item, index) => (
          <div key={index} className='cat-title'>
            <CheckboxInput id='tagtagtag' text={item} />
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
          <div>
            <h3>{strings.vagledning.matching.competencies}</h3>
            {PersonTagInput(cvData.cvCompetences)}
          </div>
          <div>
            <h3>{strings.vagledning.matching.traits}</h3>
            {PersonTagInput(cvData.cvTraits)}
          </div>
          <div>
            <h3>{strings.vagledning.matching.ocuupations}</h3>
            {PersonTagInput(cvData.cvOccupations)}
          </div>
        </div>
        <button className='button'>{strings.vagledning.cv.next}</button>
      </Form>
    </div>
  )
}

export default Competence
