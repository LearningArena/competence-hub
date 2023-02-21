import React, { useState } from 'react'
import { useContext } from 'react'
import { Link, Redirect, Route, Switch, useLocation, useRouteMatch } from 'react-router-dom'
import {
  BrowserView,
  MobileView,
  MobileOnlyView,
  isBrowser,
  isMobile,
  isMobileOnly
} from "react-device-detect"
import { LanguageContext } from '../../context/LanguageContext'
import { AuthContext } from '../../context/AuthContext'
import FullOrgInfoRoute from '../general/FullOrgInfoRoute'
import SideMenu from '../general/SideMenu'
import AddEducation from './AddEducation'
import EditEducation from './EditEducation'
import MyEducationOverview from './MyEducationOverview'
import MyOrgEducationOverview from './MyOrgEducationOverview'

const MyEducationOffers = () => {

  const location = useLocation()

  const match = useRouteMatch()
  const {strings} = useContext(LanguageContext)
  const [formData, setFormData] = useState()
  const [editFormData, setEditFormData] = useState()
  const {user, organization, allUserOrganizations} = useContext(AuthContext)
  const [openBurger, setOpenBurger] = useState('closed')
  const toggleBurger = () => {
    if(openBurger === 'closed') {
      setOpenBurger('opened')
    } else {
      setOpenBurger('closed')
    }
}

  const addActiveClass = (i, urls) => {
      return (
        location.pathname === urls[i] ? 'active' : ''
      )
  }

  const addTabClass = () => {
    if (editFormData) return 'three-tabs'
    else return 'two-tabs'
  }
  const BurgerNavButton = () => {
    return (
      <button onClick={() => toggleBurger()} className={`button icon-button icon-only burger-nav-button ${openBurger === 'opened' ? 'close-burger' : ''}`}>
        <span className="line-1">|</span><span className="line-2">|</span><span className="line-3">|</span>
     </button>
    )
  }

  const urls = [
    `${match.url}/overview`,
    `${match.url}/add`,
    editFormData ? `${match.url}/edit/${editFormData.id}` : '' 
  ]
  const generateOrgRow = (org, author) => {
    return (
        {title: org.name, url: '?org=' + org.id}
    )
  }

  return (
    <div >
      <div className={'tab-nav ' + addTabClass()}>
        <Link className={'tab-left tab-overview ' + addActiveClass(0, urls)} to={urls[0]}><h4>{strings.offerOverview}</h4></Link>
        <Link className={(editFormData ? 'tab-center' : 'tab-right') + ' tab-new ' + addActiveClass(1, urls)} to={urls[1]}><h4>{strings.offerAdd}</h4></Link>
        { editFormData ? <Link className={'tab-right tab-edit ' + addActiveClass(2, urls)} to={urls[2]}><h4>{strings.courseEdit}</h4></Link> : null }
      </div>
      <div className="tab-content">
        <Switch>
          <Route exact path={`${match.path}`}>
            <Redirect to={`${match.path}/overview`} />
          </Route>
          <Route path={`${match.path}/overview`}>
          <BrowserView viewClassName="browser-view">
        <SideMenu className='educate' placement='left' items={[
          {heading: strings.course.status},
          {title: strings.publishedCoursesOverview, url: '?filter=published'},
          {title: strings.draftCoursesOverview, url: '?filter=draft'},
          {title: strings.archivedCoursesOverview, url: '?filter=archived'}
        ]
        }/>
        <SideMenu placement='right' items={
          [ 
            {heading: strings.overview.organizations},
            ...allUserOrganizations.author.map(generateOrgRow),
            ...allUserOrganizations.member.map(generateOrgRow)]
        }/>
      </BrowserView>
      <MobileOnlyView viewClassName="mobile-view">
        <BurgerNavButton/>
        <SideMenu placement={`right mobile-menu ${openBurger}`} items={ 
          [ {heading: strings.course.status},
            {title: strings.publishedCoursesOverview, url: '?filter=published'},
            {title: strings.draftCoursesOverview, url: '?filter=draft'},
            {title: strings.archivedCoursesOverview, url: '?filter=archived'},
            {heading: strings.overview.organizations},
              ...allUserOrganizations.author.map(generateOrgRow),
            ...allUserOrganizations.member.map(generateOrgRow)
          ]
        }/>
      </MobileOnlyView>
          <MyEducationOverview/>
          </Route>
          <Route path={`${match.path}/orgoverview`}>
            <MyOrgEducationOverview />
          </Route>
          <FullOrgInfoRoute path={`${match.path}/add/:orgId?`}>
            <AddEducation formData={formData} setFormData={setFormData} />
          </FullOrgInfoRoute>
          <Route path={`${match.path}/edit/:educationId`}>
            <EditEducation formData={editFormData} setFormData={setEditFormData} />
          </Route>
        </Switch>
      </div>
    </div>
  )
}

export default MyEducationOffers
