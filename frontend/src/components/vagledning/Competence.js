import React, { useState, useContext, useEffect } from 'react'
import { CVContext } from '../../context/CVContext'
import { LanguageContext } from '../../context/LanguageContext'


const Competence = () => {

  const { strings } = useContext(LanguageContext)
  const { cvData, setCVData } = useContext(CVContext)
  const [currentCompetences, setCompetences] = useState([])

  useEffect(() => {
    if (cvData.competence) {
      setCompetences(cvData.competence)
    }
  }, [cvData.competence])

  const RenderTags = (tags) => {
    return (
      <div className='cats-wrap'>
        {tags.map((item, index) => (
          <div key={index} className='cat-title'>{item}</div>
        ))}
      </div>
    )
  }

  return (
    <>
      <div className='learn-start'>
        <div>
          {RenderTags(['apples', 'oranges', 'pears'])}
        </div>
      </div>
    </>
  )
}

export default Competence
