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
  const {user, organization, allUserOrganizations} = useContext(AuthContext)

  useEffect(() => {
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

  const generateOrgRow = (org, author) => {
    return (
        {title: org.name, url: '?org=' + org.id}
    )
  }

  return (
    <div className='educate-main tab-main'>
      <BrowserView viewClassName="browser-view">
        <SideMenu placement='left' items={[
          {title: strings.publishedCoursesOverview, url: '?filter=published'},
          {title: strings.draftCoursesOverview, url: '?filter=draft'},
          {title: strings.archivedCoursesOverview, url: '?filter=archived'}
        ]
        }/>
        <SideMenu placement='right' items={
          [ <h2 className='centered-header'>"Woop"</h2>,
            ...allUserOrganizations.author.map(generateOrgRow),
          ...allUserOrganizations.member.map(generateOrgRow)]
        }/>
      </BrowserView>
      <MobileOnlyView viewClassName="mobile-view">
        <BurgerNavButton/>
        <SideMenu placement={`right mobile-menu ${openBurger}`} items={ 
          [...allUserOrganizations.author.map(generateOrgRow),
          ...allUserOrganizations.member.map(generateOrgRow)]
      }/>
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
