import React from 'react'
import { propTypes } from 'react-bootstrap/esm/Image'
import Sticky from '../general/Sticky'

const StickyFormButtons = ({...props}) => {
  return (
    <Sticky>
    <div className='button-wrapper'>
      <div className='add-edu-buttons button-group'>
        {props.children}
      </div>
    </div>
    </Sticky>
  )
}

export default StickyFormButtons
