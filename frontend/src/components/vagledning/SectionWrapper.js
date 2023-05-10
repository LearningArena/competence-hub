import React, { useState, useContext } from 'react'
import { ReactComponent as CheckIcon } from '../../images/icon-checkmark.svg'
import '../../styles/vagledning.scss'


const SectionWrapper = ({ 
    children,
    circleText, // new prop for controlling what is written in the circles
    isChecked = false,
}) => {

    let circle;
    if (isChecked) {
      circle = <div className='circle checked'><CheckIcon style={{ width: "1em", height: "1em", fill: "white", alignSelf: "center"}} /></div>;
    } else if (circleText) {
        circle = <div className='circle unchecked'>{circleText}</div>;
    } else {
        circle = '';
    }

    return( 
        <div className='grid-container'>
            {circle}
            <div className='content'>
                {children}
            </div>
        </div> 

    );

}

export default SectionWrapper