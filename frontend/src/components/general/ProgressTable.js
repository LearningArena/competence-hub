import React from 'react'


const ProgressTable = (props) => {
  const { currentStep, totalSteps } = props;

  const renderTableRows = () => {
    let rows = [];
    for (let i = 0; i < 1; i++) {
      let row = [];
      for (let j = 0; j < totalSteps; j++) {
        if (j < currentStep) {
          row.push(<td style={{width: `${100 / totalSteps}%`, border: '1px solid black', backgroundColor: '#2D4855'}} key={j}>&nbsp;</td>);
        } else {
          row.push(<td style={{width: `${100 / totalSteps}%`, border: '1px solid black', backgroundColor: '#FFFFFF'}} key={j}>&nbsp;</td>);
        }
      }
      rows.push(<tr style={{height: '20px'}} key={i}>{row}</tr>);
    }
    return rows;
  };

  return (
    <table style={{width: '100%', tableLayout: 'fixed', margin: '0px'}}>
      <tbody>{renderTableRows()}</tbody>
    </table>
  );
};

export default ProgressTable
