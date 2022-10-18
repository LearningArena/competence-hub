import React from 'react'
import { useState } from 'react'
import { useContext } from 'react'
import { Link, Redirect, Route, Switch, useLocation, useRouteMatch } from 'react-router-dom'
import { LanguageContext } from '../../context/LanguageContext'
import MyEducationOverview from '../educate/MyEducationOverview'
import FullOrgInfoRoute from '../general/FullOrgInfoRoute'
import TabbedPage from '../general/TabbedPage'
import AddRequest from './AddRequest'
import EditInquiry from './EditInquiry'
import MyRequestsOverview from './MyRequestsOverview'

const MyEducationRequests = () => {
  const match = useRouteMatch()
  const {strings} = useContext(LanguageContext)
  const [editFormData, setEditFormData] = useState()
  
  const tabItems = editFormData ? [
    {url: `${match.url}/overview`, text:strings.offerOverview},
    {url: `${match.url}/edit/${editFormData.id}`, text:strings.inquiryEdit},
    {url: `${match.url}/add`, text:strings.offerRequest},
  
  ] : [
    {url: `${match.url}/overview`, text:strings.offerOverview},
    {url: `${match.url}/add`, text:strings.offerRequest},
  ]

  return (
    <TabbedPage items={tabItems}>
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
    </TabbedPage>
  )
}

export default MyEducationRequests