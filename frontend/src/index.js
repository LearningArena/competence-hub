import React from 'react'
import ReactDOM from 'react-dom'
import "react-datepicker/dist/react-datepicker.css"

import './styles/bootstrap-custom.scss'
import './styles/general.scss'
import './styles/main.scss'
import './styles/posts.scss'
//responsive.scss imported in footer so it is placed last
import App from './App'
import * as serviceWorker from './serviceWorker'
import { ApolloProvider } from '@apollo/client'
import { client } from './data/gqlConfig'
import { BrowserRouter as Router } from 'react-router-dom'
import NavContextProvider from './context/NavContext'
import LanguageContextProvider from './context/LanguageContext'
import PopupContextProvider from './context/PopupContext'
import AuthContextProvider from './context/AuthContext'
import PaginationContextProvider from './context/PaginationContext'


ReactDOM.render(
  <>
    {/* <React.StrictMode> */}
    <Router>
      <ApolloProvider client={client} >
        <NavContextProvider>
          <LanguageContextProvider>
            <AuthContextProvider>
              <PopupContextProvider>
                <PaginationContextProvider>
                  <App />
                </PaginationContextProvider>
              </PopupContextProvider>
            </AuthContextProvider>
          </LanguageContextProvider>
        </NavContextProvider>
      </ApolloProvider>
    </Router>
    {/* </React.StrictMode> */}
  </>
  ,
  document.getElementById('root')
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()