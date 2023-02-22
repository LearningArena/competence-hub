import React from 'react'
import { useContext } from 'react'
import { Link } from 'react-router-dom';
import { LanguageContext } from '../../context/LanguageContext'
import siteLogo from '../../images/logos/site_logo.png'

const PageBrand = () => {
  const {strings} = useContext(LanguageContext)

  return (
    <Link to='/'>
      <div className='page-brand'>
        <span className="page-logo">
        <img className='page-logo-icon' src={siteLogo}/>
        </span>
        <h1 className="page-title">{strings.siteTitle}</h1>
        <p className="page-payoff">{strings.catchphrase}</p>
      </div>
    </Link>
  )
}

export default PageBrand