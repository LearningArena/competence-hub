import React from 'react'

const TooltipBase = ({position, ...props}) => {
  
  if (!position) return null

  let contentOffset = position.leftPercentage < 50 ? (
    {left: `${position.leftPercentage-5}%`}
    ) : (
    {right: `${100-position.leftPercentage-6}%`}
  )

  return (
    <div style={{top: position.top}}className='tooltip-wrapper' {...props}>
      <div className='content-wrapper'>
        <div style={contentOffset} className='content'>
        {props.children}
        </div>
      </div>
      <div style={{left: position.left}} className="arrow-down"></div>
    </div>
  )
}

export default TooltipBase
