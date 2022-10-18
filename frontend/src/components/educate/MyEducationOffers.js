import React, { useEffect, useState } from 'react'
import { useContext } from 'react'
import { Link, Redirect, Route, Switch, useLocation, useRouteMatch } from 'react-router-dom'
import { LanguageContext } from '../../context/LanguageContext'
import FullOrgInfoRoute from '../general/FullOrgInfoRoute'
import TabbedPage from '../general/TabbedPage'
import AddEducation from './AddEducation'
import EditEducation from './EditEducation'
import MyEducationOverview from './MyEducationOverview'

const MyEducationOffers = () => {
  const match = useRouteMatch()
  const {strings} = useContext(LanguageContext)
  const [formData, setFormData] = useState()
  const [editFormData, setEditFormData] = useState()

  const tabItems = editFormData ? [
    {url: `${match.url}/overview`, text:strings.offerOverview},
    {url: `${match.url}/add`, text:strings.offerAdd},
    {url: `${match.url}/edit/${editFormData.id}`, text:strings.courseEdit},
  ] : [
    {url: `${match.url}/overview`, text:strings.offerOverview},
    {url: `${match.url}/add`, text:strings.offerAdd},
  ]

  return (
    <TabbedPage items={tabItems}>
      <Switch>
        <Route exact path={`${match.path}`}>
          <Redirect to={`${match.path}/overview`} />
        </Route>
        <Route path={`${match.path}/overview`}>
          <MyEducationOverview />
        </Route>
        <FullOrgInfoRoute path={`${match.path}/add/:educationId?`}>
          <AddEducation formData={formData} setFormData={setFormData} />
        </FullOrgInfoRoute>
        <Route path={`${match.path}/edit/:educationId`}>
          <EditEducation formData={editFormData} setFormData={setEditFormData} />
        </Route>
      </Switch>
    </TabbedPage>
  )
}

export default MyEducationOffers
