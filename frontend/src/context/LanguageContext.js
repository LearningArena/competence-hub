import React, { useEffect } from 'react'
import { useState } from 'react'
import { createContext } from 'react'
import { englishStrings } from '../data/strings/english'
import { swedishStrings } from '../data/strings/swedish'

/**
* From https://stackoverflow.com/a/48218209
* Performs a deep merge of objects and returns new object. Does not modify
* objects (immutable) and merges arrays via concatenation.
*
* @param {...object} objects - Objects to merge
* @returns {object} New object with merged key/values
*/
const mergeDeep = (...objects) => {
  const isObject = obj => obj && typeof obj === 'object';
  
  return objects.reduce((prev, obj) => {
    Object.keys(obj).forEach(key => {
      const pVal = prev[key];
      const oVal = obj[key];
      
      if (Array.isArray(pVal) && Array.isArray(oVal)) {
        prev[key] = pVal.concat(...oVal);
      }
      else if (isObject(pVal) && isObject(oVal)) {
        prev[key] = mergeDeep(pVal, oVal);
      }
      else {
        prev[key] = oVal;
      }
    });
    
    return prev;
  }, {});
}

export const LanguageContext = createContext()

const LanguageContextProvider = (props) => {

  let swedishRISEStrings
  let englishRISEStrings
  try {
    swedishRISEStrings = require('rise-frontend').swedishRISEStrings
    englishRISEStrings = require('rise-frontend').englishRISEStrings
  } catch (e) {
  }
  const [strings, setStrings] = useState(mergeDeep(swedishStrings, swedishRISEStrings))
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
      setStrings(mergeDeep(swedishStrings, swedishRISEStrings))
    } 
    else {
      setStrings(mergeDeep(englishStrings, englishRISEStrings))
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
