import React, { useState } from 'react'

export const CVContext = React.createContext()

const CVContextProvider = (props) => {

  const [cvData, setCVData] = useState(
    { cvText: '',
      cvFiles: [],
      cvCompetences: [],
      cvOccupations: [],
      cvTraits: []
    })

  return (
    <CVContext.Provider value={{ cvData, setCVData }}>
      {props.children}
    </CVContext.Provider>
  )
}

export default CVContextProvider
