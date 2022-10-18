import React from 'react'
import { useContext } from 'react'
import { Redirect, Route } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext'
import ForbiddenPage from './ForbiddenPage'

const RestrictedRoute = ({children, ...props}) => {

  const {user, userLoaded} = useContext(AuthContext)

  if (userLoaded) {
    return user ? (
      <Route {...props}>
        {children}
      </Route>
    ) : (
    <ForbiddenPage />
    )
  } else {
    return null
  }

}

export default RestrictedRoute
