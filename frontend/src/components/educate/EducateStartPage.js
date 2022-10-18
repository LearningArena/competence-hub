import React from 'react'
import { useContext } from 'react'
import { LanguageContext } from '../../context/LanguageContext'
import Bild1 from '../../images/BRG-blue-webb.png'
import Bild2 from '../../images/Goteborgs Tekniska College RGB (webb).jpg'
import Bild3 from '../../images/IHM_A_Logotype_RGB_Black.png'
import Bild4 from '../../images/logo-sigma-full-color-transparent-background.png'
import Bild5 from '../../images/ordbild_Del_av.png'
import Bild6 from '../../images/veldi_kompetens_logo_black-trans.png'
import Bild7 from '../../images/RGB_semcon_logo_red_600px.png'
import RequestList from './RequestList'

const EducateStartPage = () => {

  const {strings} = useContext(LanguageContext)

  return (
    <div className= "front-page">

      <RequestList />

      <h2>{strings.offer.frontTitle}</h2>
      <p>{strings.offer.frontText}</p>
      <div className="media">
        <img className="video" src='https://eks.tv/wp-content/uploads/2019/03/5_Video_ideas_for_business.jpg'></img>
      </div>
      <div className="partners">
        <h3>{strings.offer.partnerTitle}</h3>
        <div className="logos">
          <img className="logo" src={Bild1}></img>
          <img className="logo" src={Bild2}></img>
          <img className="logo" src={Bild3}></img>
          <img className="logo" src={Bild4}></img>
          <img className="logo" src={Bild5}></img>
          <img className="logo" src={Bild6}></img>
          <img className="logo" src={Bild7}></img>
        </div>
      </div>
      {/* <div className= 'edu-request-carousel'>
        <h2>{strings.offer.partnerTitle}</h2>
        <div className= 'carousel'>

        </div>
      </div> */}
    </div>
  )
}

export default EducateStartPage
