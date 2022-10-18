import React from 'react'
import { LanguageContext } from '../../context/LanguageContext'
import { useContext } from 'react'
import partner1 from '../../images/logos/1.png'
import partner2 from '../../images/logos/2.png'
import partner3 from '../../images/logos/3.png'
import partner4 from '../../images/logos/4.png'
import partner5 from '../../images/logos/5.jpg'
import partner6 from '../../images/logos/6.png'
import partner7 from '../../images/logos/7.png'
import partner8 from '../../images/logos/8.png'
import partner9 from '../../images/logos/9.png'
import BackButton from './BackButton'

const About = () => {
  const {strings} = useContext(LanguageContext)
  
  return (
    <div className='about info-page'>
      <BackButton />
      <h2>{strings.about.pageTitle}</h2>
      <div className='content blue-background'>
          <h3>{strings.about.about}</h3>
          <p>{strings.about.aboutText}</p>
          <h3>{strings.about.mission}</h3>
          <p>{strings.about.missionText}</p>
      </div>
      <div className='partners'>
          <h3>Samarbetspartners</h3>
          <div className='image-grid'>
            <img src={partner1}></img>
            <img src={partner2}></img>
            <img src={partner3}></img>
            <img src={partner4}></img>
            <img src={partner5}></img>
            <img src={partner6}></img>
            <img src={partner7}></img>
            <img src={partner8}></img>
            <img src={partner9}></img>
          </div>
      </div>
    </div>
  )
}

export default About
