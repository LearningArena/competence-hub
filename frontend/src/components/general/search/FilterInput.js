import React from 'react'
import Select from 'react-select'

const FilterInput = ({strings, filter, filters, setFilters}) => {
  const filterValue = filter.selected && ((filter.type === 'dropdown') ? (
    filter.selected
  ) : (
    filter.selected[0].value
  ))

  const handleDropdownChange = (evt) => {    
    
    const newActiveFilters = filters.map(item => {
      if (item.id === filter.id) {
        return {...filter, selected: evt && evt.map(v => v)}
      } else {
        return item
      }
    })
    setFilters(newActiveFilters)
  }
  
  const handleInputChange = (evt) => {

    const newActiveFilters = filters.map(item => {
      if (item.id === filter.id) {
        return {...filter, selected: [{value: evt.target.value}]}
      } else {
        return item
      }
    })
    setFilters(newActiveFilters)
  }

  return (
    <li className='filter-input'>
      <span className='label'><b>{filter.name}</b></span>
      {filter.type === 'dropdown' ? (
        <Select 
          className='dropdown'
          classNamePrefix='dropdown'
          options={filter.items}
          placeholder='Välj...'
          isMulti
          isClearable
          onChange={handleDropdownChange}
          closeMenuOnSelect={false}
          value={filterValue}
        />
      ) : (
        <input type='text' onChange={handleInputChange} value={filterValue}></input>
      )}
    </li>
  )
}

export default FilterInput
