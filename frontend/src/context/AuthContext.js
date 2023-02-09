import { useMutation, useQuery } from '@apollo/client'
import React from 'react'
import { useContext } from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { createContext } from 'react'
import { ConsoleView } from 'react-device-detect'
import ChangePasswordPopup from '../components/general/ChangePasswordPopup'
import { AUTHTEST, CURRENT_USER, CURRENT_USER_ORG, LOGOUT, USER_CLAIMS, ORG_BY_ID } from '../data/queries'
import { LanguageContext } from './LanguageContext'
import { PopupContext } from './PopupContext'

export const AuthContext = createContext()

const AuthContextProvider = (props) => {

  const [user, setUser] = useState()
  const [signupOrg, setSignupOrg] = useState()
  const [userLoaded, setUserLoaded] = useState(false)
  const [organization, setOrganization] = useState()
  const [allUserOrganizations, setAllUserOrganizations] = useState()
  const [isAuthor, setIsAuthor] = useState(false)
  const [passwordResetMode, setPasswordResetMode] = useState(false)
  //const {showPopup} = useContext(PopupContext)
  //const {loading, error, data, refetch} = useQuery(AUTHTEST)
  const {loading, error, data, refetch} = useQuery(CURRENT_USER)
  const userClaims = useQuery(USER_CLAIMS)
  const orgQuery = useQuery(CURRENT_USER_ORG)
  const [gqlLogout, logoutData] = useMutation(LOGOUT)
  const orgData = useQuery (ORG_BY_ID, {variables: {id:organization?.id}})
  const {setLanguage, language} = useContext(LanguageContext)

  // Set current user context user 
  useEffect(() => {
    if (data && data.user_current) {
      console.log(data)
      setUser(data.user_current[0])
    }
  }, [data])

  useEffect(() => {
    console.log(userClaims.data?.claims)
    const claims = userClaims.data?.claims
    if (claims) {
      const resetMode = claims.some(claim => claim.type === 'keycloak_userid')
      console.log('password reset enabled:', resetMode)

      setPasswordResetMode(resetMode)
    }
    // if (claims?.some(claim => claim.type === 'keycloak_userid')) {
    //   showPopup(<ChangePasswordPopup />)
    // }
  }, [userClaims.data])

  // useEffect(() => {
  //   if (passwordResetMode) {
  //     show
  //   }
  // }, [passwordResetMode])

  useEffect(() => {
    let org = orgQuery.data?.my_org_by_author?.nodes?.[0]
    let orgs = {author:[], member:[]}
    orgs.author = orgQuery.data?.my_org_by_author?.nodes
    orgs.member = orgQuery.data?.my_org_by_member?.nodes
    if (!!!org) {
      org = orgQuery.data?.my_org_by_member?.nodes?.[0]
    }
    if (orgs) {
      setOrganization(org)
      setAllUserOrganizations(orgs)
    } else {
      console.log('no org')
    }
  }, [orgQuery.data])

  useEffect(() => {
    setUserLoaded(!orgQuery.loading)
    console.log(orgQuery.loading)
  }, [orgQuery.loading])

  if (loading) {
  } else if (error) {
    console.log(error)
  }

  useEffect(() => {
      const edges = orgData.data?.organizations?.nodes?.[0]?.organization_user_edges ?? []
      const author = edges.filter(({user_id, relationship}) =>
      user_id === user?.id && relationship === "AUTHOR")
      author.length > 0 ? setIsAuthor(true) : setIsAuthor(false)
  }, [orgData.data])

  useEffect(() => {
      //console.log("User is author: ", isAuthor)
  }, [isAuthor])

  useEffect(() => {
    console.log("User prefered language:", user?.preference_language)
    setLanguage(user?.preference_language)

    if (!user?.preference_language)
      setLanguage('SE')
  }, [user]
  )

  const updateSignupOrg = (name, orgId, formData) => {
    setSignupOrg({name, orgId, formData})
  }

  const updateAuth = () => {
    refetch().then(res => {
      if (res.data.user_current) {
        setUser(data.user_current[0])
      }
    }).catch(err => {
      console.log(err)
    })
    orgQuery.refetch().then(res => {
      console.log(res)
      if (res.data.my_org_by_author.nodes[0]) {
        setOrganization(res.data.my_org_by_author.nodes[0])
      } else if (res.data.my_org_by_member.nodes[0]) {
        setOrganization(res.data.my_org_by_member.nodes[0])
      }
    }).catch(err => {
      console.log(err)
    })
      userClaims.refetch()
  }

  const logout = () => {
    gqlLogout().then(() => {
      setUser(null)
      setOrganization(null)
    }).catch(err => {
      console.log(err)
    })
  }

  //const orgHasMissingFields = () => Object.values(organization).some(value => value === null)
  // const orgHasMissingFields = () => Object.entries(organization)
  //   .filter(entry => entry[1] === null)
  //   .map(entry => entry[0])
  const orgHasMissingFields = () => organization.image_logo === null

  return (
    <AuthContext.Provider value={{user, updateAuth, updateSignupOrg, signupOrg, logout, organization, allUserOrganizations, userLoaded, orgHasMissingFields,passwordResetMode, isAuthor}}>
      {props.children}
    </AuthContext.Provider>
  )
}

export default AuthContextProvider