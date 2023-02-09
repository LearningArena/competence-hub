import React, { useContext } from 'react'
import { PaginationContext } from '../../context/PaginationContext'


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
  const { isDescending, setDescending, sortField, setSortField } = useContext(PaginationContext)

  const actions = {
    setSortCategory: (value) => {
      setSortField(value)
    },
    toggleDescending: () => {
      setDescending(!isDescending)
    },
  }

  return (
    <table {...props}>
      <thead>
        <tr>
        {columnInfo && columnInfo.map((col,i) => (
          <th key={i} className={col.class} onClick={col.sortField ? () => {actions.setSortCategory(col.sortField); actions.toggleDescending();} : null }>
            {col.content + (JSON.stringify(sortField) === JSON.stringify(col.sortField) ? (isDescending ? ' ↓' : ' ↑') : '')}
          </th>
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
