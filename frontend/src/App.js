import React, { useState } from 'react';
import { useContext } from 'react';
import {
  Switch,
  Route,
  Link, useLocation, Redirect
} from 'react-router-dom';
import EducateMain from './components/educate/EducateMain';
import ScriptedAddEducation from './components/educate/ScriptedAddEducation';
import FileNotFound from './components/general/FileNotFound';
import PageHeader from './components/general/PageHeader';
import PageFooter from './components/general/PageFooter';
import LearnMain from './components/learn/LearnMain';
import { LanguageContext } from './context/LanguageContext';
import { NavContext } from './context/NavContext';
import GqlTest from './GqlTest';
import About from './components/general/About';
import VagledningMain from './components/vagledning/VagledningMain';
import Faq from './components/general/Faq';
import Privacy from './components/general/Privacy';
import Contact from './components/general/Contact';
import Cookies from './components/general/Cookies';
import ReleaseNotes from './components/general/ReleaseNotes';
import JSONAddEducation from './components/educate/JSONAddEducation';
import OrgReminder from './components/accounts/OrgReminder';
import RestrictedRoute from './components/general/RestrictedRoute';
import LoginRoute from './components/general/LoginRoute';
import {
  BrowserView,
  MobileView,
  MobileOnlyView,
  isBrowser,
  isMobile
} from "react-device-detect"
import ChangePasswordTrigger from './components/general/ChangePasswordTrigger';

function App() {

  const [authPassword, setAuthPassword] = useState(localStorage.getItem('authentication'))
  
  return (
    <div className={`App ${isMobile ? 'mobile-view' : 'desktop-view'}`}> 
      <PageHeader />
      <OrgReminder />
      <ChangePasswordTrigger />
      <div className={'tab-content'}>
        <Switch>
          <Route path='/learn'>
            <LearnMain />
          </Route>
          <RestrictedRoute path='/educate'>
            <EducateMain />
          </RestrictedRoute>
          <Route path='/about'>
            <About />
          </Route>
          <Route path='/vagledning'>
            <VagledningMain />
          </Route>
          <Route exact path='/'>
            <Redirect to='/learn' />
          </Route>
          <Route exact path='/login'>
            <LoginRoute />
          </Route>
          <Route path='/faq'>
            <Faq />
          </Route>
          <Route path='/contact'>
            <Contact />
          </Route>
          <Route path='/privacy'>
            <Privacy />
          </Route>
          <Route path='/cookies'>
            <Cookies />
          </Route>
          <Route path='/releasenotes'>
            <ReleaseNotes />
          </Route>
          <Route exact path='/jsonadd'>
            <JSONAddEducation />
          </Route>
          <Route path='*'>
            <FileNotFound />
          </Route>
          {process.env.NODE_ENV === 'development' &&
          <>
            <Route exact path='/graphtest'>
              <GqlTest />
            </Route>
            <Route exact path='/scriptedadd'>
              <ScriptedAddEducation />
            </Route>
          </>
          }
        </Switch>
        <PageFooter />
      </div>
    </div>
  );
}

export default App;
