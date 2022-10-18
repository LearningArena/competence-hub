import React from 'react'
import { useState } from 'react'
import { createContext } from 'react'

export const NavContext = createContext()

const NavContextProvider = (props) => {

  const [learnUrl, setLearnUrl] = useState('/learn')
  const [educateUrl, setEducateUrl] = useState('/educate')

  return (
    <NavContext.Provider value={{learnUrl, setLearnUrl, educateUrl, setEducateUrl}}>
      {props.children}
    </NavContext.Provider>
  )
}

export default NavContextProvider
