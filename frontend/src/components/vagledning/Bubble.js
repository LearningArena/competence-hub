import React from 'react'
import bubbleIcon from '../../images/bubble.svg'
import '../../styles/vagledning.scss'


const Bubble = ({ children }) => {
    return( 
        <div className='grid-container'>
            <div className='bubble'>
                {children}
            </div>
        </div>
    );
  };

  export default Bubble