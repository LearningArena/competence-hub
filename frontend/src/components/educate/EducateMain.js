import React from 'react'
import '../../styles/educate.scss'
import {
  BrowserView,
  MobileView,
  MobileOnlyView,
  isBrowser,
  isMobile,
  isMobileOnly
} from "react-device-detect"
import { useEffect, useState } from 'react'
import { useContext } from 'react'
import { Redirect, Route, Switch, useLocation, useRouteMatch } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext'
import { LanguageContext } from '../../context/LanguageContext'
import { NavContext } from '../../context/NavContext'
import FileNotFound from '../general/FileNotFound'
import SideMenu from '../general/SideMenu'
import SearchBar from '../general/search/SearchBar'
import Signup from '../accounts/Signup'
import SignupSuccess from '../accounts/SignupSuccess'
import MyEducationOffers from './MyEducationOffers'
import AccountUser from '../accounts/AccountUser'
import OrgUser from '../accounts/AccountOrg'
import RequestList from './RequestList'

const EducateMain = () => {
  let match = useRouteMatch()
  const location = useLocation()
  const {setEducateUrl} = useContext(NavContext)

  useEffect(() => {
    setEducateUrl(location.pathname)
  }, [location.pathname, setEducateUrl])


  return (
    <div className='educate-main tab-main'>
      <div className="content-main">
        <Switch>
          <Route path={`${match.path}/account`}>
            <AccountUser />
          </Route>
          <Route path={`${match.path}/organisationskonto`}>
            <OrgUser />
          </Route>
          <Route path={`${match.path}/myeducation`}>
            <MyEducationOffers />
          </Route>
          <Route exact path={`${match.path}/signup`}>
            <Signup />
          </Route>
          <Route exact path={`${match.path}/signup/success`}>
            <SignupSuccess />
          </Route>
          <Route exact path={`${match.path}`}>
            <Redirect to={`${match.path}/myeducation`}/>
          </Route>
          <Route path='*'>
            <FileNotFound />
          </Route>
        </Switch>
      </div>
    </div>
  )
}

export default EducateMain
