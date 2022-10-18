import React from 'react'
import '../../styles/accounts.scss'
import { useContext } from 'react'
import { Link, Route, Switch, useRouteMatch, useLocation } from 'react-router-dom'
import OrgContent from './AccountOrgContent'
import { LanguageContext } from '../../context/LanguageContext'
import AllUsers from './AccountOrgAllUsers'

const AccountOrg = () => {
    const match = useRouteMatch()
    const {strings} = useContext(LanguageContext)
    const location = useLocation()
    const checkActive = location.pathname === `${match.url}/anvandare`
    return (
        <div className='account-page user-page account-org'>
        <div className='tab-nav'>
            <Link className={'tab-left' + (checkActive ? '' : ' active')} to={`${match.url}`}><h4>{strings.account.companyAccount}</h4></Link>
            <Link className={'tab-right' + (checkActive ? ' active' : '')}  to={`${match.url}/anvandare`}><h4>{strings.account.userAccount}</h4></Link>
            </div>
            <div className="tab-content box box-full cols-1">
                <Switch>
                    <Route exact path={`${match.url}`}>
                        <OrgContent />
                    </Route>
                    <Route path={`${match.url}/anvandare`}>
                        <AllUsers />
                    </Route>
                </Switch>
            </div>
          
        </div>
        
    )
}

export default AccountOrg