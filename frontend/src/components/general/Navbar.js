import React from 'react'
import { link, animateScroll as scroll } from "react-scroll"

const Navbar = ({items, classes}) => {
  return (
    <nav className={'navbar ' + classes}>
    <ul className='nav-list'>
      {items.map((item,index) => (
        
        <li key={index} className='nav-item'>
         {item.render}
       </li>
      ))}
      </ul>
    </nav>
  )
}

export default Navbar