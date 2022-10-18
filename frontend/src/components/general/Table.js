import React from 'react'
import {ReactComponent as EditIcon} from '../../images/icon-edit.svg'

const TableItem = ({info, Icon}) => {
  return (
    <tr>
    {info.map((cell,i) => {
      return <td key={i}>{cell}</td>
    })}
    </tr>
  )
}

const Table = ({columnInfo, content, ...props}) => {

  return (
    <table {...props}>
      <thead>
        <tr>
        {columnInfo && columnInfo.map((col,i) => (
          <th key={i} className={col.class}>{col.content}</th>
        ))}
        </tr>
      </thead>
      <tbody>
      {content && content.map((rowData,i) => (
        <TableItem key={i} info={rowData}/>
      ))}
      </tbody>
    </table>
  )
}

export default Table
