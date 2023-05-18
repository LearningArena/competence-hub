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
  const [competences, setCompetences] = useState({})
  const [skills, setSkills] = useState({})
  const [occupations, setOccupations] = useState({})
  const [occupationGroups, setOccupationGroups] = useState({})
  const [occupationFields, setOccupationFields] = useState({})

  return (
    <GuidanceContext.Provider value={{ cvData, setCVData, competences, setCompetences, skills, setSkills, occupations, setOccupations, occupationGroups, setOccupationGroups, occupationFields, setOccupationFields }}>
      {props.children}
    </GuidanceContext.Provider>
  )
}

export default GuidanceContextProvider
