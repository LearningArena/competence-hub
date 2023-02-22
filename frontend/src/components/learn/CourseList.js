import React, { useContext, useState, useEffect } from 'react'
import { LanguageContext } from '../../context/LanguageContext'
import { PaginationContext } from '../../context/PaginationContext'
import SearchFilter from '../general/search/SearchFilterNoToggle'
import SearchBar from '../general/search/SearchBar'
import PostSort from '../general/PostSort'
import CourseItem from './CourseItem'

import {ReactComponent as FilterIcon} from '../../images/filter-icon.svg'

import {
  BrowserView,
  MobileView,
  isMobile,
} from "react-device-detect"
import Masonry from "react-responsive-masonry"


const CourseList = ({heading, courses, hideSearchBar, hideFilters}) => {
  const {strings} = useContext(LanguageContext)

  const { isListView } = useContext(PaginationContext)

  const [openMobFilter, setOpenMobFilter] = useState('closed')

  const toggleMobFilter = () => {
      if(openMobFilter === 'closed') {
        setOpenMobFilter('opened')
      } else {
        setOpenMobFilter('closed')
      }
  }

 const RenderListView = () => {
   return (
    <div className='postgrid-flex list-view'>
    <h2>{heading}</h2>
    <div className='postgrid-wrap'>
      {courses.map(course => (
        <CourseItem key={course.id} course={course} ListView={isListView} />
        ))}
    </div>
  </div>
   )
 }

 let cols = ""
 if (isMobile) {cols = 1} else {cols = 2}
 const RenderGridView = () => {
  return (
   <div className='postgrid-flex grid-view'>
   <h2>{heading}</h2>
   <div className='postgrid-wrap'>
     <Masonry columnsCount={cols} gutter={"30px"}>
     {courses.map(course => (
       <CourseItem key={course.id} course={course} ListView={isListView} />
       ))}
     </Masonry>
   </div>
 </div>
  )
}

  return (
    <div className='course-list'>
      { (hideSearchBar) ?
        <></>
          : 
         <SearchBar placeHolderText={strings.search.learnPlaceholder} />
      }
      <MobileView>
        <button onClick={() => toggleMobFilter()} className="toggle-filter">
            <FilterIcon /> <h4>Filter</h4>
        </button>
        <div  className={`post-filter-sort ${openMobFilter}`}>
        { (hideFilters) ? 
          <></>
         : 
          <SearchFilter />
          }
          <PostSort menuPlace="top" />
        </div>
      </MobileView>
      <></>
      <BrowserView>
          <div className="post-filter-sort">
            {(hideFilters) ?
              <></>
              :
              <SearchFilter />
            }
            <PostSort menuPlace="auto" />
          </div>
      </BrowserView>
      {isListView ? (<RenderListView />) : (<RenderGridView />)}
    </div>
  )
}

export default CourseList
