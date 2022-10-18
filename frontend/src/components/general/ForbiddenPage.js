import React, { useContext } from 'react'
import { LanguageContext } from '../../context/LanguageContext'



const ForbiddenPage = () => {
  
  const {strings} = useContext(LanguageContext)
  return (
    <div className='about info-page'>
      <h2>{strings.forbidden.title}</h2>
      <div className='content'>
        <p>{strings.forbidden.info}</p>
      </div>
    </div>
  )
}

export default ForbiddenPage