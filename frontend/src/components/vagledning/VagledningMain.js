import React from 'react'
import { LanguageContext } from '../../context/LanguageContext'
import { useContext } from 'react'
import { Route, Redirect, Switch, useRouteMatch } from 'react-router-dom'
import CVStart from './CVStart'
import Competence from './Competence'
import { BrowserView } from "react-device-detect"
import SideMenu from '../general/SideMenu'


const VagledningMain = () => {
  let match = useRouteMatch()
  const { strings } = useContext(LanguageContext)

  return (
    <div className='educate-main tab-main'>
      <BrowserView viewClassName="broswer-view">
        <SideMenu placement='left' items={[
          { title: strings.sidemenuCV, url: match.url + '/cv' },
          { title: strings.sidemenuCompetence, url: match.url + '/competence' },
        ]} />
      </BrowserView>
      <div className='content-main'>
        <Switch>
          <Route path={`${match.path}/cv`}>
            <CVStart />
          </Route>
          <Route path={`${match.path}/competence`}>
            <Competence />
          </Route>
          <Route exact path={`${match.path}`}>
            <Redirect to={`${match.path}/cv`} />
          </Route>
        </Switch>
      </div>
    </div>
  )
}

export default VagledningMain
