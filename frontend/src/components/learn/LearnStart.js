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

  const { getCurrent, getPage, pageNum, pageCursors, resetPagination, hasPrev, hasNext, ready } = usePagination(PUBLISHED_COURSES, 2, PaginationContext)


  useEffect(() => {
    if (!ready) {
      setLoading(true)
      return
    }
    getCurrent({ variables: { record_status: "APPROVED" } })
      .then(({ loading, error, data }) => {
        setCourses(data.courses.nodes)
        setLoading(false)
      })
  }, [ready])

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
        {pageCursors.map((_, i) =>
          <button className={'button ' + (pageNum == i ? 'inactive':'')} disabled={pageNum == i ? true : false} onClick={() => getPage(i).then(
            ({ loading, error, data }) => {
              setCourses(data.courses.nodes)
              setLoading(loading)
          })}>{ i+1 }</button>
        )}
      </div>
    </>
  )
}

export default LearnStart