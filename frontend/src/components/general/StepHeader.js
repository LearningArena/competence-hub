import React from 'react'


const StepHeader = (props) => {
  const { currentStep, text } = props;

  return (
    <div style={{marginLeft: '-75px', display: 'flex', flexDirection: 'row'}}>
      <div style={{width: '75px', lineHeight: '50px'}}>
        <div style={{color: 'white', fontSize: 30, textAlign: 'center', width: '50px', height: '50px', borderRadius: '75%', background: '#2D4855'}}>
          {currentStep}
        </div>
      </div>
      <h3>{text}</h3>
    </div>
  );
};

export default StepHeader
