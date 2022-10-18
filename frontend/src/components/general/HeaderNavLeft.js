import React from 'react'
import { Link } from 'react-router-dom'

const HeaderNavLeft = () => {
  return (
    <nav id='header-nav-left' className='navbar header-nav'>
      <span class='nav-item'>
         <Link to={item.url}>{item.title}</Link>
      </span>
    </nav>
  )
}

export default Navbar
