import React, { useState, useContext, useEffect } from 'react'
import { LanguageContext } from '../../context/LanguageContext'
import { GuidanceContext } from '../../context/GuidanceContext'
import CVForm from './CVForm'
import '../../styles/vagledning.scss'
import { getOccGroupForecasts } from '../../util/arbetsformedlingen'
import InsightComponent from './Insight'

const handleSubmit = (evt) => {
  evt.preventDefault()
}

const CVMain = () => {

  const [showInsight, setShowInsight] = useState(false);
  const { strings } = useContext(LanguageContext)
  const [formData, setFormData] = useState()
  const { occGroupForecasts, setOccGroupForecasts } = useContext(GuidanceContext)

  useEffect(() => {
    if (Object.keys(occGroupForecasts).length == 0) {
      const fetchForecasts = async () => {
        let forecastData = await getOccGroupForecasts();
        let newState = {}
        newState = forecastData.reduce((obj, item) => {
          return {
            ...obj,
            [item.concept_id+":"+((2000+item.ar) - (new Date().getFullYear()))]: {
                "shortage": item.bristvarde
              },
          }
        }, newState)
        console.log("forecasts:", Object.keys(newState).length)
        setOccGroupForecasts(newState)
      }
      fetchForecasts();
    }
  }, []);

  return (
    <div>

      <div className='content'>
        <h2 id='heading-mod'>{strings.vagledning.cv.Header}</h2>
        <p dangerouslySetInnerHTML={{__html: strings.vagledning.cv.Preamble}} />
      </div>

      <div className='content'>
        <h3 id='heading-mod'>{strings.vagledning.cv.cvUpload}</h3>
        <CVForm formData={formData} setFormData={setFormData} submitForm={handleSubmit} setShowInsight={setShowInsight} />
      </div>
      {showInsight && <InsightComponent />} {/* Render InsightComponent when showInsight is true */}


    </div>
  );


}

export default CVMain
