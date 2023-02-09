import React from 'react'
import {useState} from 'react'
import queryString from 'query-string'
import { Link, useLocation, useRouteMatch } from 'react-router-dom'
import {
  BrowserView,
  MobileView,
  MobileOnlyView,
  isBrowser,
  isMobile,
  isMobileOnly
} from "react-device-detect"

const SideMenu = ({items, placement}) => {
  
  const Slugify = (string) => {
    return string
      .toString()
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w\-]+/g, "")
      .replace(/\-\-+/g, "-")
      .replace(/^-+/, "")
      .replace(/-+$/, "");
  }

  //Burger nav
  const [openBurger, setOpenBurger] = useState('closed')
  const { search } = useLocation()

  const toggleBurger = () => {
      if(openBurger === 'closed') {
        setOpenBurger('opened')
      } else {
        setOpenBurger('closed')
      }
  }

  const BurgerNavButton = () => {
    return (
      <button onClick={() => toggleBurger()} className={`button icon-button icon-only burger-nav-button ${openBurger === 'opened' ? 'close-burger' : ''}`}>
        <span className="line-1">|</span><span className="line-2">|</span><span className="line-3">|</span>
      </button>
    )
  }  

  const location = useLocation()
  
  return (
    <div className={'sidemenu ' + placement}>
      {isMobileOnly ? BurgerNavButton : ''}
      {items.map(item => {
        let idSlug = Slugify(item.title ? item.title : "");
        let isActive = false
        let newSearch
        let oldSearch
        let toObj
        if (item.url?.includes('?')) {
          const newSearch = queryString.parse(item.url)
          const oldSearch = queryString.parse(search)
          isActive = oldSearch[Object.keys(newSearch)[0]] === newSearch[Object.keys(newSearch)[0]]
          toObj = {search: "?" + new URLSearchParams({...oldSearch, ...newSearch}).toString()}
        } else {
          isActive = item.exact ? (location.pathname === item.url) : location.pathname.startsWith(item.url)
          toObj = item.url
        }
        return (
          <Link id={'menu-' + idSlug} key={item.url} to={toObj} className={isActive ? 'active' : ''} ><h3>{item.title}</h3></Link>
        )}
      )}
    </div>
  )
}

export default SideMenu