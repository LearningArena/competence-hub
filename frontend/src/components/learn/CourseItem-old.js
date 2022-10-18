import React from 'react'
import { useState } from 'react'
import { useContext } from 'react'
import { Link, useParams } from 'react-router-dom'
import { formatDate } from '../../util/date'
import { dummyCourses, dummyCategories } from '../../data/dummy/courses'
import {ReactComponent as ArrowIcon } from '../../images/icon_arrow.svg'
import {ReactComponent as PinIcon } from '../../images/icon-pinned.svg'
import { LanguageContext } from '../../context/LanguageContext'

const CourseItem = ({course, ListView}) => {
    const {strings} = useContext(LanguageContext)
    const category = dummyCategories.find(cat => cat.id === course.categoryId)

    let description = course.description
    function truncate(str, no_words) {
      return str && str.split(" ").splice(0,no_words).join(" ");
    }
    let excerpt = truncate(course.description, 40)
  
    const [expanded, setExpanded] = useState(false)
  
    return (
      <div className={'course-item post-item course-summary ' + (expanded ? ' expanded' : '')}>
      <div className='post-header'>
        <div className='post-title'>
          <span className='title-item'><Link to={"/learn/course/" + course.id}><h4>{course.title}</h4></Link></span> 
          <span className='title-item'>{course.organisation}</span>
          <span className='title-item'>{course.location}</span>
        </div>
        <div className='post-pin'>
            <button className="button icon-only"><PinIcon/></button>
        </div>
      </div>
      {/* <img src={require('../../data/dummy/' + course.bannerImage)} alt=""/> */}
      {course.image_feature ? (
        <span className='post-image'><Link to={"/learn/course/" + course.id}><img src={course.image_feature}/></Link></span>
      ) : (
        <span className='post-image'><Link to={"/learn/course/" + course.id}><img src={require('../../data/dummy/img/banner.png')} alt=""/></Link></span>
      )}
      <div className='content'>
        <ul className='post-meta-list course-meta-list'>
            { course.category && 
            <li className='post-meta-item course-meta-item'><span>{strings.course.category}</span><b>{course.category && course.category}</b></li>
            }
            { course.provider && 
            <li className='post-meta-item course-meta-item more-meta'><span>{strings.course.provider}</span><b>{course.education_provider}</b></li>
            }
            { course.city && 
            <li className='post-meta-item course-meta-item more-meta'><span>{strings.course.city}</span><b>{course.city}</b></li>
            }
            {course.start_date &&
            <li className='post-meta-item course-meta-item more-meta'><span>{strings.course.dates}</span><b>{`${formatDate(course.start_date)} - ${formatDate(course.end_date)}`}</b></li>
            }
            {course.studypace &&
            <li className='post-meta-item course-meta-item more-meta'><span>{strings.course.pace}</span><b>{course.studypace}</b></li>
            }
            {course.language &&
            <li className='post-meta-item course-meta-item more-meta'><span>{strings.course.language}</span><b>{course.language}</b></li>
            }
        </ul>
        <div className='description'><p className="excerpt">{excerpt} ...</p></div>
        <Link to={"/learn/course/" + course.id} className='button link-button read-more'>{strings.course.more}</Link>
      </div>
     { ListView && 
     <>
      <div className='show-more' onClick={() => setExpanded(!expanded)}>
        <span>{strings.course.showMore}</span>
        <ArrowIcon />
      </div>
    </>
     }
    </div>
    )
}

export default CourseItem
