import React from 'react'
import {ReactComponent as PlusIcon} from '../../../images/icon-plus.svg'

const FilterItem = ({title, active, toggleFilter}) => {

  return (
    <li className='filter-item'>
      <span>{title}</span>
      {active ? (
         <button onClick={toggleFilter} className='button icon-button icon-only close'>
          <PlusIcon />
        </button>
      ) : (
        <button onClick={toggleFilter} className='button icon-button icon-only'>
          <PlusIcon  />
        </button>
      )}
    </li>
  )
}

export default FilterItem
