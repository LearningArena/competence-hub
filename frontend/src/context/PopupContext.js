import React from 'react'
import { useState } from 'react'
import PopupBase from '../components/general/PopupBase'
import TooltipBase from '../components/general/TooltipBase'


export const PopupContext = React.createContext()

const PopupContextProvider = (props) => {

  const [popupActive, setPopupActive] = useState(false)
  const [popupContent, setPopupContent] = useState()
  const [popupType, setPopupType] = useState('popup')
  const [popupOptions, setPopupOptions] = useState()
  const [popupClass, setPopupClass] = useState('popup-basic')
  const [extraProps, setExtraProps] = useState()

  const showPopup = (content, className='popup-basic') => {
    setPopupContent(content)
    setPopupActive(true)
    setPopupType('popup')
    setPopupClass(className)
  }
  const showTooltip = (content, refElement) => {

    const refRect = refElement.current.getBoundingClientRect()
    const elX = window.pageXOffset + refRect.left
    const elY = window.pageYOffset + refRect.top
    const percentageX = 100*(elX / window.innerWidth)
    let position = {
      top: elY,
      left: elX,
      leftPercentage:percentageX,
    }

    setExtraProps({
      position: position
    })
    setPopupContent(content)
    setPopupActive(true)
    setPopupType('tooltip')
  }

  const hidePopup = () => {
    setPopupActive(false)
    setPopupContent(null)
  }

  const markup = popupType === 'popup' ? (
    <PopupBase className={popupClass} hide={hidePopup} options={popupOptions}>
      {popupContent}
    </PopupBase>
  ) : (
    <TooltipBase {...extraProps}>
      {popupContent}
    </TooltipBase>
  )

  return (
    <PopupContext.Provider value={{showPopup, showTooltip, hidePopup, setPopupOptions, popupActive}}>
      {popupActive && 
        markup
      }
      {props.children}
    </PopupContext.Provider>
  )
}

export default PopupContextProvider
