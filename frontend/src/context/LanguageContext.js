import React, { useEffect } from 'react'
import { useState } from 'react'
import { createContext } from 'react'
import { englishStrings } from '../data/strings/english'
import { swedishStrings } from '../data/strings/swedish'

export const LanguageContext = createContext()

const LanguageContextProvider = (props) => {

  let swedishRISEStrings
  let englishRISEStrings
  try {
    swedishRISEStrings = require('rise-frontend').swedishRISEStrings
    englishRISEStrings = require('rise-frontend').englishRISEStrings
  } catch (e) {
  }
  const [strings, setStrings] = useState({...swedishStrings, ...swedishRISEStrings})
  const [language, setLanguageInternal] = useState('SE')


  useEffect(() => {
    console.log("Swedish rise strings are", swedishRISEStrings)
  })

  useEffect(() => {
    const storedLanguage = localStorage.getItem('language')
    if (storedLanguage) {
      setLanguage(storedLanguage)
    }
  }, [])

  const setLanguage = (language) => {
    if (language === 'SE') {
      setStrings({...swedishStrings, ...swedishRISEStrings})
    } 
    else {
      setStrings({...englishStrings, ...englishRISEStrings})
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
