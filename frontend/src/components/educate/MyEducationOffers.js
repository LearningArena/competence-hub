import React, { useState } from 'react'
import { useContext } from 'react'
import { Link, Redirect, Route, Switch, useLocation, useRouteMatch } from 'react-router-dom'
import { LanguageContext } from '../../context/LanguageContext'
import { AuthContext } from '../../context/AuthContext'
import FullOrgInfoRoute from '../general/FullOrgInfoRoute'
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
  const {isAuthor} = useContext(AuthContext)

  const addActiveClass = (i, urls) => {
      return (
        location.pathname === urls[i] ? 'active' : ''
      )
  }

  const addTabClass = (urls) => {
    if (urls.length === 2) return 'two-tabs'
    else if (urls.length === 3) return 'three-tabs'
    else return 'four-tabs'
  }

  const urls = [
    `${match.url}/overview`,
    ... isAuthor ? [`${match.url}/orgoverview`] : [],
    `${match.url}/add`,
    ... editFormData ? [`${match.url}/edit/${editFormData.id}`] : [] 
  ]

  return (
    <div >
      <div className={'tab-nav ' + addTabClass(urls)}>
        <Link className={'tab-left tab-overview ' + addActiveClass(0, urls)} to={urls[0]}><h4>{strings.offerOverview}</h4></Link>
        { isAuthor ? <Link className={'tab-center tab-org-overview ' + addActiveClass(1, urls)} to={urls[1]}><h4>{strings.offerOrgOverview}</h4></Link> : null }
        <Link className={(editFormData ? 'tab-center' : 'tab-right') + ' tab-new ' + addActiveClass(2, urls)} to={urls[2]}><h4>{strings.offerAdd}</h4></Link>
        { editFormData ? <Link className={'tab-right tab-edit ' + addActiveClass(3, urls)} to={urls[3]}><h4>{strings.courseEdit}</h4></Link> : null }
      </div>
      <div className="tab-content">
        <Switch>
          <Route exact path={`${match.path}`}>
            <Redirect to={`${match.path}/overview`} />
          </Route>
          <Route path={`${match.path}/overview`}>
            <MyEducationOverview />
          </Route>
          <Route path={`${match.path}/orgoverview`}>
            <MyOrgEducationOverview />
          </Route>
          <FullOrgInfoRoute path={`${match.path}/add/:educationId?`}>
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
