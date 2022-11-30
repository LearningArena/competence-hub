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

  const { ready, getCurrent, getPage, pageNum, pageCursors } = usePagination(COURSE_BY_CATEGORY, 8, PaginationContext)

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
      <div className='button-container load-more'>
        {pageCursors.map((_, i) =>
          <button key={i} className={'button ' + (pageNum == i ? 'inactive':'')} disabled={pageNum == i ? true : false} onClick={() => getPage(i, { variables: { cat: category.slug, record_status: "APPROVED" } }).then(
            ({ loading, error, data }) => {
              setCourses(data.courses.nodes)
              setLoading(loading)
          })}>{ i+1 }</button>
        )}
      </div>
    </>
  )
}

export default CategoryCourses