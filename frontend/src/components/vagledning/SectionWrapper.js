import React, { useState, useContext } from 'react'
import '../../styles/vagledning.scss'


const SectionWrapper = ({ 
    children
}) => {

    return( 
        <div className='grid-container'>
            <div className='content'>
                {children}
            </div>
        </div> 

    );

}

export default SectionWrapper