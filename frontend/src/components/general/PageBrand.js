import React from 'react'
import { useContext } from 'react'
import { useState } from 'react'
import { ReactComponent as PageLogo } from '../../images/SVG/kompetensmatchning.se_logo.svg'
import { Link } from 'react-router-dom';
import { LanguageContext } from '../../context/LanguageContext'

const PageBrand = () => {
  const {strings} = useContext(LanguageContext)

  return (
    <Link to='/'>
      <div className='page-brand'>
        <span className="page-logo">
        <PageLogo className="page-logo-icon"/>
        </span>
        <h1 className="page-title">Kompetensmatchning</h1>
        <p className="page-payoff">{strings.catchphrase}</p>
      </div>
    </Link>
  )
}

export default PageBrand