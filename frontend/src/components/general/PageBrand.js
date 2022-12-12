import React from 'react'
import siteLogo from '../../images/logos/site_logo.png'

const PageBrand = () => {
  return (

    <div className='page-brand'>
          <span className="page-logo">
            <a href="https://kompetensmatchning.se/">
              <img className='page-logo-icon' src={siteLogo}/>
            </a>
          </span>
          <a href="https://kompetensmatchning.se/"><h1 className="page-title">Website title</h1></a>
          <a href="https://kompetensmatchning.se/"><p className="page-payoff">Website subtitle</p></a>
    </div>

  )
}

export default PageBrand