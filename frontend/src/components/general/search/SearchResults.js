import React, { useState, useEffect, useContext } from 'react'
import { useParams } from 'react-router-dom'
import { LanguageContext } from '../../../context/LanguageContext'
import { PaginationContext } from '../../../context/PaginationContext'
import CourseList from '../../learn/CourseList'
import { COURSE_SEARCH } from '../../../data/queries';
import { usePagination } from '../../../hooks/usePagination'


const SearchResults = () => {

  const { strings } = useContext(LanguageContext)
  const { query } = useParams()
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)

  const { ready, getCurrent, getPage, pageNum, pageCursors } = usePagination(COURSE_SEARCH, 8, PaginationContext)

  useEffect(() => {
    if (!ready) {
      setLoading(true)
      return
    }
    getCurrent({ variables: { query, record_status: "APPROVED" } })
      .then(({ loading, error, data }) => {
        setCourses(data.courses.nodes)
        setLoading(false)
      })
  }, [ready])

  return (
    <div>
      {loading ?
        <p>Loading</p> :
        <CourseList courses={courses} />
      }
      <div className='button-container load-more'>
        {pageCursors.map((_, i) =>
          <button key={i} className={'button ' + (pageNum == i ? 'inactive':'')} disabled={pageNum == i ? true : false} onClick={() => getPage(i, { variables: {query} }).then(
            ({ loading, error, data }) => {
              setCourses(data.courses.nodes)
              setLoading(loading)
          })}>{ i+1 }</button>
        )}
      </div>
    </div>
  )
}

export default SearchResults
