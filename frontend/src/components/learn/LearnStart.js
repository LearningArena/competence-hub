import React, { useState, useEffect, useContext } from 'react'
import { LanguageContext } from '../../context/LanguageContext'
import { PaginationContext } from '../../context/PaginationContext'
import CategoryList from './CategoryList'
import CourseList from './CourseList'
import { PUBLISHED_COURSES } from '../../data/queries';
import { usePagination } from '../../hooks/usePagination'

const LearnStart = (props) => {
  const { strings } = useContext(LanguageContext)
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)

  const { PaginationControls, getCurrent, ready } = usePagination(PUBLISHED_COURSES, 10, PaginationContext)

  useEffect(() => {
    if (!ready) {
      return
    }
    getCurrent({ variables: { record_status: "APPROVED" } })
      .then(({ loading, error, data }) => {
        setCourses(data.courses.nodes)
        setLoading(false)
      })
  }, [ready])

  const updateCourses = (data) => {
    setCourses(data.courses.nodes)
  }

  return (
    <>
      <div className='learn-start'>
        <p className='start-search-text'>{strings.learnStartText}</p>
        {loading ?
          <p>Loading</p> :
          <CourseList heading={strings.learnStartPostsTitle} courses={courses} />
        }
      </div>
      <div className="sidebar-right posts-sidebar">
        <CategoryList titleText='Kategorier' area='learn' style='list' />
      </div>
      <div className='button-container load-more'>
        <PaginationControls updateFunc={updateCourses} />
      </div>
    </>
  )
}

export default LearnStart