import React from 'react'
import { useContext, useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { LanguageContext } from '../../context/LanguageContext'
import { PaginationContext } from '../../context/PaginationContext'
import CategoryList from './CategoryList'
import CourseList from './CourseList'
import { COURSE_BY_CATEGORY } from '../../data/queries'
import { fields } from '../../data/fields'
import { usePagination } from '../../hooks/usePagination'

const CategoryCourses = () => {

  const { strings } = useContext(LanguageContext)
  const { categoryId } = useParams()
  const category = fields.categoriesList.find(cat => cat.slug === categoryId)
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)

  const { ready, getCurrent, getPrev, getNext, resetPagination, hasPrev, hasNext } = usePagination(COURSE_BY_CATEGORY, 8, PaginationContext)

  useEffect(() => {
    if (!ready) {
      setLoading(true)
      return
    }
    getCurrent({ variables: { cat: category.slug, record_status: "APPROVED" } })
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
        <CourseList courses={courses} />
      )}
      <div className="sidebar-right posts-sidebar">
        <CategoryList titleText='Kategorier' area='learn' style='list' />
      </div>
      {hasNext ?
        (
          <div className='button-container load-more'>
            <button className='button align-center load-more' onClick={() => getNext({ variables: { cat: category.slug, record_status: "APPROVED" } }).then(({ loading, error, data }) => {
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

export default CategoryCourses