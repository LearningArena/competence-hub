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

  const { PaginationControls, ready, getCurrent, } = usePagination(FAVORITE_COURSES, 10, PaginationContext)

  const updateCourses = (data) => {
    setCourses(data.courses.nodes)
  }

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
      <div className='button-container load-more'>
        <PaginationControls updateFunc={updateCourses} />
      </div>
    </>
  )
}

export default FavoriteCourses