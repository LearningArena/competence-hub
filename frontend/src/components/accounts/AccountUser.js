import React from 'react'
import '../../styles/accounts.scss'
import { useContext } from 'react'
import { Link, Route, Switch, useRouteMatch, useLocation } from 'react-router-dom'
import UserContent from './AccountUserContent'
import { LanguageContext } from '../../context/LanguageContext'
import OrgContent from './AccountOrgContent'

const AccountUser = () => {
    const match = useRouteMatch()
    const {strings} = useContext(LanguageContext)
    const location = useLocation()
    const checkActive = location.pathname === `${match.url}/organisationsinfo`
     

    return (
        <div className='account-page user-page user-super'>
             { <div className='tab-nav'>
            <Link className={'tab-left' + (checkActive ? '' : ' active')} to={`${match.url}`}><h4>{strings.account.header}</h4></Link>
            <Link className={'tab-right' + (checkActive ? ' active' : '')}  to={`${match.url}/organisationsinfo`}><h4>{strings.account.companyAccount}</h4></Link>
            </div>}
            <div className="tab-content box box-full cols-1">
                <Switch>
                    <Route exact path={`${match.url}`}>
                        <UserContent />
                    </Route>
                    <Route path={`${match.url}/organisationsinfo`}>
                        <OrgContent />
                    </Route>
                </Switch>
                </div>
        </div>
    )
}

export default AccountUser
