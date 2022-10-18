import React from 'react'
import { useEffect } from 'react'
import { useRef } from 'react'
import { useState } from 'react'
import { link, nimateScroll as scroll } from 'react-scroll'

const Sticky = ({topOffset, updateHeight, ...props}) => {

  const [isSticky, setSticky] = useState(false)
  const [elemHeight, setElemHeight] = useState()
  const stickyRef = useRef(null)
  const childRef = useRef(null)
  
  const handleScroll = () => {
    
    if (stickyRef.current) {
      if (isSticky) {
          setSticky(stickyRef.current.getBoundingClientRect().top < topOffset + elemHeight)
        } else {
          setSticky(stickyRef.current.getBoundingClientRect().top < topOffset)
        }
      }
    }
  

  useEffect (() =>  {
    setElemHeight(stickyRef.current.getBoundingClientRect().height)
    let ro = new ResizeObserver(entries => {
      setElemHeight(entries[0].contentRect.height)
    })
    ro.observe(childRef.current)
    React.Children.toArray(props.children)
    console.log(props.children)
    window.addEventListener('scroll', handleScroll);  
    return () => {
      window.removeEventListener('scroll', () => handleScroll)
    }
  }, [])

  return (
    <div ref={stickyRef} style={{height: elemHeight}} className={'sticky-wrapper' + (isSticky ? ' sticky' : '')}>
      {/* <div ref={heightRef} className='child-container' > */}
      {React.cloneElement(props.children, {ref: childRef})}
      {/* </div> */}
    </div>
  )
} 

Sticky.defaultProps = {
  topOffset: 0
}

export default Sticky