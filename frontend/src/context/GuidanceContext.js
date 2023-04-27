import React, { useState } from 'react'

export const GuidanceContext = React.createContext()

const GuidanceContextProvider = (props) => {

  const [cvData, setCVData] = useState(
    { cvText: '',
      cvFiles: [],
      cvCompetences: [],
      cvOccupations: [],
      cvTraits: []
    })
  const [competences, setCompetences] = useState([])
  const [occupations, setOccupations] = useState([])
  const [occupationGroups, setOccupationGroups] = useState([])

  return (
    <GuidanceContext.Provider value={{ cvData, setCVData, competences, setCompetences, occupations, setOccupations, occupationGroups, setOccupationGroups }}>
      {props.children}
    </GuidanceContext.Provider>
  )
}

export default GuidanceContextProvider
