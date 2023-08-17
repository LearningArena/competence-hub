import React, { useState, useContext, useEffect } from 'react'
import { LanguageContext } from '../../context/LanguageContext'
import { GuidanceContext } from '../../context/GuidanceContext'
import CVForm from './CVForm'
import '../../styles/vagledning.scss'
import SectionWrapper from './SectionWrapper'
import { getOccGroupForecasts } from '../../util/arbetsformedlingen'

const handleSubmit = (evt) => {
  evt.preventDefault()
}

const CVMain = () => {

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

  const cards = [
    {title: "Card 1", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."},
    {title: "Card 2", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."},
    {title: "Card 3", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."},
    {title: "Card 4", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."},
    {title: "Card 5", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."},
    {title: "Card 6", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."},
    {title: "Card 7", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."}
  ];

  return (
    <div>

      <SectionWrapper>
        <h2 id='heading-mod'>{strings.vagledning.cv.Header}</h2>
        <p dangerouslySetInnerHTML={{__html: strings.vagledning.cv.Preamble}} />
      </SectionWrapper>

      <SectionWrapper>
        <h3 id='heading-mod'>{strings.vagledning.cv.cvUpload}</h3>
        <CVForm formData={formData} setFormData={setFormData} submitForm={handleSubmit} />
      </SectionWrapper>

    </div>
  );


}

export default CVMain
