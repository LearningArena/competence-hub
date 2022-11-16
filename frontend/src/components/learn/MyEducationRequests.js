import React from 'react'
import { useState } from 'react'
import { useContext } from 'react'
import { Link, Redirect, Route, Switch, useLocation, useRouteMatch } from 'react-router-dom'
import { LanguageContext } from '../../context/LanguageContext'
import FullOrgInfoRoute from '../general/FullOrgInfoRoute'
import AddRequest from './AddRequest'
import EditInquiry from './EditInquiry'
import MyRequestsOverview from './MyRequestsOverview'

const MyEducationRequests = () => {
  const location = useLocation()

  const match = useRouteMatch()
  const {strings} = useContext(LanguageContext)
  const [editFormData, setEditFormData] = useState()

  const addActiveClass = (i) => {
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
    `${match.url}/add`,
    ... editFormData ? [`${match.url}/edit/${editFormData.id}`] : [] 
  ]
  
  return (
    <div>
      <div className={'tab-nav ' + addTabClass(urls)}>
        <Link className={'tab-left tab-overview ' + addActiveClass(0, urls)} to={`${match.url}/overview`}><h4>{strings.offerOverview}</h4></Link>
        <Link className={editFormData ? 'tab-center' : 'tab-right' + ' tab-new ' + addActiveClass(2, urls)} to={`${match.url}/add`}><h4>{strings.offerRequest}</h4></Link>
        { editFormData ? <Link className={'tab-center tab-edit ' + addActiveClass(3, urls)} to={`${match.url}/edit/${editFormData.id}`}><h4>{strings.inquiryEdit}</h4></Link> : null }
      </div>
      <div className="tab-content">
        <Switch>
          <Route exact path={`${match.path}`}>
            <Redirect to={`${match.path}/overview`} />
          </Route>
          <Route path={`${match.path}/overview`}>
            <MyRequestsOverview />
          </Route>
          <FullOrgInfoRoute path={`${match.path}/add`}>
            <AddRequest />
          </FullOrgInfoRoute>
          <Route path={`${match.path}/edit/:id`}>
            <EditInquiry formData={editFormData} setFormData={setEditFormData} />
          </Route>
        </Switch>
      </div>
    </div>
  )
}

export default MyEducationRequests