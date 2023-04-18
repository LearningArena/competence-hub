import React from 'react'
import { LanguageContext } from '../../context/LanguageContext'
import { useContext } from 'react'
import { Link, Route, Switch, useRouteMatch } from 'react-router-dom'
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
