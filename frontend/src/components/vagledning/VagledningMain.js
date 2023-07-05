import React from 'react'
import '../../styles/vagledning.scss'
import { LanguageContext } from '../../context/LanguageContext'
import { useContext } from 'react'
import { Link, Route, Switch, useRouteMatch } from 'react-router-dom'
import CVStart from './CVStart'
import Insight from './Insight'
import Outlook from './Outlook'
import Future from './Future'
import { BrowserView } from "react-device-detect"
import SideMenu from '../general/SideMenu'


const VagledningMain = () => {
  let match = useRouteMatch()
  const { strings } = useContext(LanguageContext)

  return (
    <div className='educate-main tab-main'>
      <BrowserView viewClassName="broswer-view">
        {/* <SideMenu placement='left' items={[
          { title: strings.vagledning.sidemenuStart, url: match.url + '/cv' },
          { title: strings.vagledning.sidemenuInsight, url: match.url + '/insight' },
          { title: strings.vagledning.sidemenuOutlook, url: match.url + '#' },
          { title: strings.vagledning.sidemenuFuture, url: match.url + '#' },
          { title: strings.vagledning.sidemenuMyPath, url: match.url + '#' },
        ]} /> */}
      </BrowserView>
      <div className='content-main'>
        <Switch>
          <Route path={`${match.path}/cv`}>
            <CVStart />
          </Route>
          <Route path={`${match.path}/insight`}>
            <Insight />
          </Route>
          <Route path={`${match.path}/outlook`}>
            <Outlook />
          </Route>
          <Route path={`${match.path}/future`}>
            <Future />
          </Route>
          <Route exact path={`${match.path}`}>
            <div className='vagledning-main'>
              <div className='vagledning-p'>
                <p>{strings.vagledning.ingress}</p>
              </div>
              <div className='vagledning-path'>
                <Link to={`${match.path}/cv`}>
                  <button className='button'>{strings.vagledning.haveCV}</button>
                </Link>
              </div>
              {/* <div className='vagledning-path'>
                <Link to={`${match.path}/ad`}>
                  <button className='button'>{strings.vagledning.haveAd}</button>
                </Link>
              </div> */}
            </div>
          </Route>
        </Switch>
      </div>
    </div>
  )
}

export default VagledningMain
