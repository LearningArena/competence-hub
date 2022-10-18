import React from 'react'
import { ReactComponent as PageLogo } from '../../images/SVG/kompetensmatchning.se_logo.svg'

const PageBrand = () => {
  return (

    <div className='page-brand'>
          <span className="page-logo">
          <a href="https://kompetensmatchning.se/"><PageLogo className="page-logo-icon"/></a>
          </span>
          <a href="https://kompetensmatchning.se/"><h1 className="page-title">Kompetensmatchning</h1></a>
          <a href="https://kompetensmatchning.se/"><p className="page-payoff">Arena för livslångt lärande</p></a>
    </div>

  )
}

export default PageBrand