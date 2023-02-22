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
  const {strings} = useContext(LanguageContext)
  const {user} = useContext(AuthContext)

  useEffect(() => {
    console.log(location.pathname)
    setEducateUrl(location.pathname)
  }, [location.pathname, setEducateUrl])

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
    <div className='educate-main tab-main'>
      <BrowserView viewClassName="broswer-view">
        <SideMenu placement='right' items={true ? [
          {title: strings.sidemenuMyEducations, url: match.url + '/myeducation'},
          // {title: strings.sidemenuRequests, url: match.url + '/efterlysningar'},
          // {title: strings.sidemenuFavAds, url: match.url + '/myads'},
        
          {title: strings.sidemenuMyAccount, url: match.url + '/account'},
          // {title: strings.sidemenuOrgAccount, url: match.url + '/organisationskonto'}, 
          //{title: strings.signup.header, url: match.url + '/signup'},
        ] : [
          // {title: strings.signup.header, url: match.url + '/signup'},
        ]}/>
      </BrowserView>
      <MobileOnlyView viewClassName="mobile-view">
        <BurgerNavButton/>
        <SideMenu placement={`right mobile-menu ${openBurger}`} items={user ? [
            {title: strings.sidemenuMyEducations, url: match.url + '/myeducation'},
            // {title: strings.sidemenuRequests, url: match.url + '/efterlysningar'},
            // {title: strings.sidemenuFavAds, url: match.url + '/myads'},
           
            {title: strings.sidemenuMyAccount, url: match.url + '/account'},
            // {title: strings.sidemenuOrgAccount, url: match.url + '/organisationskonto'}, 
            //{title: strings.signup.header, url: match.url + '/signup'},
          ] : [
            // {title: strings.signup.header, url: match.url + '/signup'},
      ]}/>
      </MobileOnlyView>
      <div className="content-main">
        <Switch>
          <Route path={`${match.path}/account`}>
            <AccountUser />
          </Route>
          <Route path={`${match.path}/organisationskonto`}>
            <OrgUser />
          </Route>
          {/* <Route path={`${match.path}/efterlysningar`}>
               <SearchBar placeHolderText={strings.search.eduPlaceholder} /> 
              <RequestList />
          </Route> */}
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
