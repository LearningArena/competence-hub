import React from 'react'
import { useContext, useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { LanguageContext } from '../../context/LanguageContext'
import { PaginationContext } from '../../context/PaginationContext'
import CourseList from './CourseList'
import { FAVORITE_COURSES } from '../../data/queries'
import { fields } from '../../data/fields'
import { usePagination } from '../../hooks/usePagination'

const FavoriteCourses = () => {

  const { categoryId } = useParams()
  const { strings } = useContext(LanguageContext)
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const category = fields.categoriesList.find(cat => cat.slug === categoryId)

  const { ready, getCurrent, getPrev, getNext, resetPagination, totalLoaded, hasPrev, hasNext } = usePagination(FAVORITE_COURSES, 8, PaginationContext)


  useEffect(() => {
    if (!ready) {
      setLoading(true)
      return
    }
    getCurrent()
    .then(({ loading, error, data }) => {
      setCourses(data.courses.nodes)
      setLoading(false)
    })
  }, [ready])

  return (
    <>
      {loading ? (
        <p>Loading</p>
      ) : (
        <CourseList heading={strings.favoritePostsTitle} courses={courses} hideSearchBar={true} hideFilters={true} />
      )}
      {hasNext ?
        (
          <div className='button-container load-more'>
            <button className='button align-center load-more' onClick={() => getNext().then(({ loading, error, data }) => {
              setCourses(courses.concat(data.courses.nodes))
              setLoading(loading)
            })}>
              {strings.loadMoreCourses}
            </button>
          </div>
        ) :
        <></>
      }
    </>
  )
}

export default FavoriteCourses