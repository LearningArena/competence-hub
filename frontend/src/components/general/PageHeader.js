import React from 'react'
import {
  BrowserView,
  MobileView,
  MobileOnlyView,
  isBrowser,
  isMobile,
  isMobileOnly
} from "react-device-detect"
import '../../styles/header.scss'
import {useEffect, useState, useRef, useContext} from 'react'
import { Link, useLocation } from 'react-router-dom'
import { PopupContext } from '../../context/PopupContext'
import LoginPopup from './LoginPopup'
import Navbar from './Navbar'
import PageBrand from './PageBrand'
import { LanguageContext } from '../../context/LanguageContext'
import { NavContext } from '../../context/NavContext'
import { AuthContext } from '../../context/AuthContext'
import { useMutation } from '@apollo/client'
import { LOGOUT } from '../../data/queries'
import Sticky from './Sticky'


// const StickyFunction = ({ref}) => {
  
// }

const NavLanguage = () => {
  const {setLanguage, language} = useContext(LanguageContext)

  const handleChange = (evt) => {
    console.log(evt.target.value)
    setLanguage(evt.target.value)
  }

  return (
    <select id='select-language' name='select-language' className='select-language' value={language} onChange={handleChange}>
      <option value='SE' style={{background: 'white', color: 'black'}}>Svenska</option>
      <option value='GB' style={{background: 'white', color: 'black'}}>English</option>
    </select>
  
  )
}

const PageHeader = () => {
  let RISEBrand = null
  // const RISEBrand = lazy(() => import('rise-frontend'));

  try {
    RISEBrand = require('rise-frontend').RISEBrand
  } catch (e) {
  }
  
  const location = useLocation()
  //TBS
  const {learnUrl, educateUrl} = useContext(NavContext)
  const {strings} = useContext(LanguageContext)
  const {showPopup} = useContext(PopupContext)
  const {user, updateAuth, logout} = useContext(AuthContext)
  const [openBurger, setOpenBurger] = useState('closed')

  const toggleBurger = () => {
      if(openBurger === 'closed') {
        setOpenBurger('opened')
      } else {
        setOpenBurger('closed')
      }
  }

  const BurgerNavButton = () => {
    return (
      <button onClick={() => toggleBurger()} className={`button icon-button icon-only burger-nav-button ${openBurger === 'opened' ? 'close-burger' : ''}`}>
        <span className="line-1">|</span><span className="line-2">|</span><span className="line-3">|</span>
     </button>
    )
  }

  //Nav items
  const navAbout = <Link to={'/about'} ><h3>Om</h3></Link>
  const currentUser = user ? <h3>{strings.loggedAs} {user.firstname} {user.lastname}</h3> :  <Link to='/learn/signup'><h3>{strings.signup.header}</h3></Link>
  const navLogIn = user ? (
    <>
      <button onClick={logout}><h3>{strings.logout}</h3></button>
    </>
  ) : (
    <button onClick={() => showPopup(<LoginPopup />)}><h3>{strings.login}</h3></button>
  )

  const NavLanguageItem = <NavLanguage/>

  const forceLogin = (evt) => {
    if (!user) {
      evt.preventDefault()
      showPopup(<LoginPopup />)
    }
  }

 

  return (
  
    // <header className={`page-header sticky-parent' ${isSticky ? ' sticky' : ''}`} ref={ref}>
      <header className='page-header'>
          <div className='page-header-wrap'>
            <BrowserView viewClassName='page-header-menu'>
              <Navbar classes='header-nav nav-left' items={[
                {'render' : navAbout}
              ]}/>
                { RISEBrand ? <RISEBrand /> : <PageBrand />} 
              <Navbar classes='header-nav nav-right' items={[
                {'render' : currentUser},
                {'render' : navLogIn},
                {'render' :  NavLanguageItem}
              ]}/>
            </BrowserView>
            
            <MobileOnlyView viewClassName='page-header-menu mobile-header-menu'>
            { RISEBrand ? <RISEBrand /> : <PageBrand />} 
            <BurgerNavButton/>
              <Navbar classes={`header-nav mobile-header-nav burger-nav ${openBurger}`} items={[
                  {'render' : navAbout},
                  {'render' : currentUser},
                  {'render' : navLogIn},
                  {'render' :  NavLanguageItem}
                ]}/>
            </MobileOnlyView>
            <div className='page-tab-nav tab-nav' >
              <Link className={`tab tab-learn ${location.pathname === learnUrl ? 'active' : ''}`} to={location.pathname === learnUrl ? '/learn' : learnUrl}><h2>{isMobileOnly ? strings.mainTabLearnMobile : strings.mainTabLearn}</h2></Link>
              <span className='flex-pusher'>&nbsp;</span>
              <Link className={`tab tab-educate ${location.pathname === educateUrl ? 'active' : ''}`} onClick={forceLogin} to={location.pathname === educateUrl ? '/educate' : educateUrl}><h2>{isMobileOnly ? strings.mainTabEducateMobile : strings.mainTabEducate }</h2></Link>
             </div>
          </div>
    </header>
  )
}

export default PageHeader
