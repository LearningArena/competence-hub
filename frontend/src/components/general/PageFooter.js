import React from 'react'
import '../../styles/footer.scss'
import '../../styles/responsive.scss'
import { useContext } from 'react'
import { Link } from 'react-router-dom'
import Navbar from './Navbar'
import riselogo from '../../images/logos/rise_logo_rgb_pos_vit.png'
import vglogo from '../../images/logos/2.png'
import { LanguageContext } from '../../context/LanguageContext'

const PageHeader = () => {
  let partnerLogos = null
  try {
    partnerLogos = require('rise-frontend').partnerLogos
  } catch (e) {
  }

  const {strings} = useContext(LanguageContext)

  //Nav items
  const NavContact = <a href="mailto:kontakt@kompetensmatchning.se"><h3>{strings.footer.contact}</h3></a>
  //const NavContact = <Link to={'/contact'} ><h3>{strings.footer.contact}</h3></Link>     //Disabled for now instead ref to mail adress
  const NavFAQ = <Link to= {'/faq'}><h3>{strings.footer.faq}</h3></Link>
  const NavCookie = <Link to= {'/cookies'}><h3>{strings.footer.cookies}</h3></Link>
  const NavPolicy = <Link to= {'/privacy'}><h3>{strings.footer.privacy}</h3></Link>
  const NavReleaseNotes= <Link to= {'/releasenotes'}><h3>Release Notes</h3></Link>
 
  return (
    <footer className='page-footer'>
        <div className='footer-wrap'>
          <div className='footer-navarea'>
            <Navbar classes='footer-nav nav-left' items={[
              {'render' : NavContact},
              {'render' : NavFAQ}
              ]}/>

            <Navbar classes='header-nav nav-right' items={[
              {'render' : NavCookie},
              {'render' :  NavPolicy},
              {'render' :  NavReleaseNotes}
            ]}/>
          </div>
          <div className='rise-footer'>

            <h3>{strings.footer.title}</h3>
            <div className='rise-footer-wrap'>
              <div className='rise-logo col-1'>
                <div className='rise-logo-border'>
                <img src={ partnerLogos ? partnerLogos.partner2 : vglogo} className='rise-logo-img-1'></img> 
                </div>
                <div className='rise-logo-border'>
                <img src={ partnerLogos ? partnerLogos.riseLogo : riselogo} className='rise-logo-img-2'></img>
                </div>
              </div>
              <div className='about-rise col-2'>
                <p>{strings.footer.description}</p>
              </div>
              <div className='contact-rise col-3'>
                <h5>{strings.footer.moreInfo}</h5>
              <a href={'https://'+strings.footer.web}><p>{strings.footer.web}</p></a>
              <h5 className='contact'>{strings.footer.contact}</h5>
              <p>{strings.footer.phone}</p>
              <a href={'mailto:'+strings.footer.email}><p>{strings.footer.email}</p></a>
              </div>
            </div>
          </div>
        </div>
    </footer>
  )
}

export default PageHeader