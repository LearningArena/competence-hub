
import React from 'react'
import { Link, useLocation } from 'react-router-dom'

const TabbedPage = ({items,...props}) => {

  const location = useLocation()
  const secondActive = location.pathname === items[1].url

  const addActiveClass = (i) => {
      return (
        location.pathname === items[i].url ? 'active' : ''
      )
  }

  
  
  return (

    <div>
     
        {(items.length === 2) &&
          <div className='tab-nav two-tabs'>
            <Link className={'tab-left tab-overview ' + addActiveClass(0)} to={items[0].url}><h4>{items[0].text}</h4></Link>
            <Link className={'tab-right tab-new ' + addActiveClass(1)} to={items[1].url}><h4>{items[1].text}</h4></Link>
          </div>
        }
       
        {(items.length === 3) && 
          <div className='tab-nav three-tabs'>
            <Link className={'tab-left tab-overview ' + addActiveClass(0)} to={items[0].url}><h4>{items[0].text}</h4></Link>
            <Link className={'tab-center tab-new ' + addActiveClass(1)} to={items[1].url}><h4>{items[1].text}</h4></Link>
            <Link className={'tab-right tab-edit ' + addActiveClass(2)} to={items[2].url}><h4>{items[2].text}</h4></Link>
          </div>
        }
    
      <div className="tab-content">
        {props.children}
      </div>
    </div>
  )
}

export default TabbedPage