import React from 'react'
import { ReactComponent as IconByGrid } from '../../images/icon_posts-by-grid.svg'
import { ReactComponent as IconByList } from '../../images/icon_posts-by-list.svg'
import { ReactComponent as IconOrder } from '../../images/icon_posts-order-list.svg'
import { useContext } from 'react'
import { PaginationContext } from '../../context/PaginationContext'

import { LanguageContext } from '../../context/LanguageContext'
import Select from 'react-select'

// import CategoryList from '../educate/CategoryList'

const PostSort = ({menuPlace}) => {

  const { isListView, setListView, isDescending, setDescending, sortField, setSortField } = useContext(PaginationContext)

  const {strings} = useContext(LanguageContext)

  const actions = {
    setSortCategory: (evt) => {setSortField(evt.value)},
    toggleDescending: () => {setDescending(!isDescending)},
    setListView: () => {setListView(true)},
    setGridView: () => {setListView(false)},
  }

      
  const options = 
    [{label: strings.course.title, value: 'title'},
    {label: strings.course.city, value: 'city'},
    {label: strings.course.category, value: 'category'},
    {label: strings.course.start, value: 'id'}]

  return (
    <div className='posts-sort'>  
      <div id='sort-by' className='sort-group'>
        <label htmlFor='sort-by-select'>{strings.sortBy}</label>
        <Select className='dropdown-sortable' classNamePrefix='dropdown' menuPlacement={menuPlace} onChange={actions.setSortCategory} placeholder={options.find(option => option.value === sortField).label} options={options}/>
      </div>
      <div id='sort-order' className='sort-group sort-invert'>
          <button onClick={actions.toggleDescending} id='sort-order-button' className='button icon-button'><IconOrder className={isDescending ? 'flipped' : ''} /></button>
      </div>
      <div id='sort-view' className='sort-group'>
          <label htmlFor='sort-view-button'>Vy</label>
          <button onClick={actions.setGridView} id='sort-view-button' className={'button icon-button' + (isListView ? ' not-active' : '')}><IconByGrid/></button>
          <button onClick={actions.setListView} id='sort-view-by-button' className={'button icon-button' + (isListView ? '' : ' not-active')}><IconByList/></button>
      </div>
    </div>
  )

}

export default PostSort