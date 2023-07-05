import React, { useState } from 'react'

export const GuidanceContext = React.createContext()

const GuidanceContextProvider = (props) => {

  const [cvText, setCvText] = useState('')
  const [cvCompetences, setCvCompetences] = useState({})
  const [cvOccupations, setCvOccupations] = useState({})
  const [skills, setSkills] = useState({})
  const [occupations, setOccupations] = useState({})
  const [occupationGroups, setOccupationGroups] = useState({})
  const [occupationFields, setOccupationFields] = useState({})

  return (
    <GuidanceContext.Provider value={{ cvText, setCvText, cvCompetences, setCvCompetences, cvOccupations, setCvOccupations, skills, setSkills, occupations, setOccupations, occupationGroups, setOccupationGroups, occupationFields, setOccupationFields }}>
      {props.children}
    </GuidanceContext.Provider>
  )
}

export default GuidanceContextProvider
