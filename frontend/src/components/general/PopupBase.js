import React from 'react'
import {ReactComponent as CloseIcon} from '../../images/icon-close.svg'
import {
  isMobile
} from "react-device-detect"

const PopupBase = ({className, hide, options, ...props}) => {

  const newClassName = options?.noStyle ? '' : className;

  return (
    
    <div className={`popup-wrapper ${isMobile ? 'mobile-view' : 'desktop-view'}`}>
      <div className={`popup-content ${newClassName}`}>
        {props.children}
        <CloseIcon onClick={hide} className='close-icon' />
      </div>
      <div onClick={options?.noDismiss ? null : hide} className='popup-padding' />
    </div>
  )
}

export default PopupBase
