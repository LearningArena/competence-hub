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
  let partnerLogos = null
  try {
    partnerLogos = require('rise-frontend').partnerLogos
    console.log("img imported successfully", partnerLogos)
  } catch (e) {
    console.log("Not found image", e)
  }
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
            <img src={ partnerLogos ? partnerLogos.partner1 : partner1}></img>
            <img src={ partnerLogos ? partnerLogos.partner2 : partner2}></img>
            <img src={ partnerLogos ? partnerLogos.partner3 : partner3}></img>
            <img src={ partnerLogos ? partnerLogos.partner4 : partner4}></img>
            <img src={ partnerLogos ? partnerLogos.partner5 : partner5}></img>
            <img src={ partnerLogos ? partnerLogos.partner6 : partner6}></img>
            <img src={ partnerLogos ? partnerLogos.partner7 : partner7}></img>
            <img src={ partnerLogos ? partnerLogos.partner8 : partner8}></img>
            <img src={ partnerLogos ? partnerLogos.partner9 : partner9}></img>
          </div>
      </div>
    </div>
  )
}

export default About
