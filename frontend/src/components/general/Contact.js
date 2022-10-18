import React from 'react'
import { useContext } from 'react'
import { LanguageContext } from '../../context/LanguageContext'

const Contact = () => {
    const {strings} = useContext(LanguageContext)

    return (
        <div className='info-page category-list-wrap'>
          <h2>{strings.contact.heading}</h2>  
          <div className ='content'>
            <div>
            <p>Kundtjänst via email: support@kompetensmatchning.se.</p>

            <p>Kontakta oss gärna om du har några frågor! Vi försöker alltid svara så snabbt vi kan.</p>

            <h5>Address</h5>
            <p>Kompetensmatchning av RISE AB</p>
            <p>Box 829</p>
            <p>391 28 Borås </p>
            <p>Sverige</p>
            <p>Org.nr: .....</p>

            </div>
          </div>
        </div>
        )
    }
    
    export default Contact