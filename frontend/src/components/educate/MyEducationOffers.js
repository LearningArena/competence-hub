import React, { useState } from 'react'
import { useContext } from 'react'
import { Link, Redirect, Route, Switch, useLocation, useRouteMatch } from 'react-router-dom'
import { LanguageContext } from '../../context/LanguageContext'
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

  const addActiveClass = (i, urls) => {
      return (
        location.pathname === urls[i] ? 'active' : ''
      )
  }

  const addTabClass = () => {
    if (editFormData) return 'three-tabs'
    else return 'two-tabs'
  }

  const urls = [
    `${match.url}/overview`,
    `${match.url}/add`,
    editFormData ? `${match.url}/edit/${editFormData.id}` : '' 
  ]

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
