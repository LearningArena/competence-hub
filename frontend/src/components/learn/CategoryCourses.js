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

  const { PaginationControls, ready, getCurrent,} = usePagination(COURSE_BY_CATEGORY, 8, PaginationContext)

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

  const updateCourses = (data) => {
    setCourses(data.courses.nodes)
  }

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
        <PaginationControls variables={{cat: category.slug, record_status: "APPROVED" }} updateFunc={updateCourses} />
      </div>
    </>
  )
}

export default CategoryCourses