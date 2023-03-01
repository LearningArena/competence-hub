import React from 'react'
import '../../styles/learn.scss'
import { useContext, useEffect, useState } from 'react'
import {
  BrowserView,
  MobileView,
  MobileOnlyView,
  isBrowser,
  isMobile,
  isMobileOnly
} from "react-device-detect"
import { Redirect, Route, Switch, useLocation, useRouteMatch } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext'
import { LanguageContext } from '../../context/LanguageContext'
import { NavContext } from '../../context/NavContext'
import FileNotFound from '../general/FileNotFound'
import AccountUser from '../accounts/AccountUser'
import OrgUser from '../accounts/AccountOrg'
import SearchBar from '../general/search/SearchBar'
import SearchResults from '../general/search/SearchResults'
import SideMenu from '../general/SideMenu'
import Signup from '../accounts/Signup'
import SignupSuccess from '../accounts/SignupSuccess'
import CategoryCourses from './CategoryCourses'
import CategoryList from './CategoryList'
import LearnStart from './LearnStart'
import LearnFavorites from './LearnFavorites'
import CourseInformation, { CourseInformationById } from './CourseInformation'
import LearnMyAccount from './LearnMyAccount'
import MyEducationRequests from './MyEducationRequests'
import RestrictedRoute from '../general/RestrictedRoute'

const LearnMain = () => {
  
  let match = useRouteMatch()
  const location = useLocation()
  const {setLearnUrl} = useContext(NavContext)
  const {strings} = useContext(LanguageContext)
  const {user} = useContext(AuthContext)

  useEffect(() => {
    console.log(location.pathname)
    setLearnUrl(unused => location.pathname)
  }, [location.pathname, setLearnUrl])

  const [openBurger, setOpenBurger] = useState('closed')

  const toggleBurger = () => {
    if(openBurger === 'closed') {
      setOpenBurger('opened')
    } else {
      setOpenBurger('closed')
    }
}

  const BurgerNavButton = () => {
    return (
      <button onClick={() => toggleBurger()} className={`button icon-button icon-only burger-nav-button ${openBurger === 'opened' ? 'close-burger' : ''}`}>
        <span className="line-1">|</span><span className="line-2">|</span><span className="line-3">|</span>
     </button>
    )
  }

  return (
    <div className='learn-main tab-main'>
      <BrowserView viewClassName="broswer-view">
       <SideMenu placement='left' items={user ? [
        {title: strings.sidemenuStart, url: match.url + '/utbildningar'},
        {title: strings.sidemenuFavEducations, url: match.url + '/sparade-utbildningar'},
        // {title: strings.sidemenuMyAds, url: match.url + '/myrequests'},
        {title: strings.sidemenuMyAccount, url: match.url + '/account'},
        // {title: strings.sidemenuOrgAccount, url: match.url + '/organisationskonto'},
      ] : [
        
      ]}/>
      </BrowserView>
      <MobileOnlyView viewClassName="mobile-view">
        <BurgerNavButton/>
        <SideMenu placement={`left mobile-menu ${openBurger}`} items={user ? [
        {title: strings.sidemenuStart, url: match.url + '/utbildningar'},
        {title: strings.sidemenuFavEducations, url: match.url + '/sparade-utbildningar'},
        // {title: strings.sidemenuMyAds, url: match.url + '/myrequests'},
        {title: strings.sidemenuMyAccount, url: match.url + '/account'},
        // {title: strings.sidemenuOrgAccount, url: match.url + '/organisationskonto'},
      ] : [
        {title: strings.sidemenuStart, url: match.url + '/utbildningar'},
        {title: strings.signup.header, url: match.url + '/signup'},
      ]}/>
      </MobileOnlyView>
      <div className='content-main'>
        <Switch>
          <Route path={`${match.path}/utbildningar`}>
            <LearnStart />
          </Route>
          <RestrictedRoute path={`${match.path}/account`}>
            <AccountUser />
          </RestrictedRoute>
          {/* <RestrictedRoute path={`${match.path}/organisationskonto`}>
            <OrgUser />
          </RestrictedRoute> */}
          <Route exact path={`${match.path}/category`}>
            <CategoryList titleText='Hitta efter kategori' area='learn' style='grid'/>
          </Route>
          <Route path={`${match.path}/category/:categoryId`}>
            <CategoryCourses />
          </Route>
          <Route path={`${match.path}/search/:query`}>
            <SearchResults />
          </Route>
          <Route path={`${match.path}/course/:id?`}>
            <CourseInformationById />
          </Route>
          <Route path={`${match.path}/sparade-utbildningar`}>
            <LearnFavorites />
          </Route>
          {/* <RestrictedRoute path={`${match.path}/myrequests`}>
            <MyEducationRequests />
          </RestrictedRoute> */}
          <Route exact path={`${match.path}/signup`}>
            <Signup />
          </Route>
          <Route path={`${match.path}/signup/success`}>
            <SignupSuccess />
          </Route>
          <Route exact path={`${match.path}`}>
            <Redirect to={`${match.path}/utbildningar`} />
          </Route>
          <Route path='*'>
            <FileNotFound />
          </Route>
        </Switch>
      </div>
    </div>
  )
}

export default LearnMain