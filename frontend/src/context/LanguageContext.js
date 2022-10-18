import React, { useEffect } from 'react'
import { useState } from 'react'
import { createContext } from 'react'
import { englishStrings } from '../data/strings/english'
import {swedishStrings} from '../data/strings/swedish'

export const LanguageContext = createContext()

const LanguageContextProvider = (props) => {

  const [strings, setStrings] = useState(swedishStrings)
  const [language, setLanguageInternal] = useState('SE')

  useEffect(() => {
    const storedLanguage = localStorage.getItem('language')
    if (storedLanguage) {
      setLanguage(storedLanguage)
    }
  }, [])

  const setLanguage = (language) => {
    if (language === 'SE') {
      setStrings(swedishStrings)
    } 
    else {
      setStrings(englishStrings)
    }
    localStorage.setItem('language', language)
    setLanguageInternal(language)
  }

  return (
    <LanguageContext.Provider value={{strings, setLanguage, language}}>
      {props.children}
    </LanguageContext.Provider>
  )
}

export default LanguageContextProvider
