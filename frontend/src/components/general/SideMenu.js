import React from 'react'
import {useState} from 'react'
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
        const isActive = item.exact ? (location.pathname === item.url) : location.pathname.startsWith(item.url)
        return (
          <Link id={'menu-' + idSlug} key={item.url} to={item.url} className={isActive ? 'active' : ''} ><h3>{item.title}</h3></Link>
        )}
      )}
    </div>
  )
}

export default SideMenu