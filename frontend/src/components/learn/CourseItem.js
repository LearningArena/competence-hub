import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { useContext } from 'react'
import { Link, useParams } from 'react-router-dom'
import { formatDate } from '../../util/date'
import { dummyCourses, dummyCategories } from '../../data/dummy/courses'
import {ReactComponent as ArrowIcon } from '../../images/icon_arrow.svg'
import {ReactComponent as PinIcon } from '../../images/icon-pinned.svg'
import { LanguageContext } from '../../context/LanguageContext'
import FadeIn from 'react-fade-in'
import { AuthContext } from '../../context/AuthContext'
import { getCategoryString } from '../../util/category'
import { useMutation } from '@apollo/client'
import { PIN_COURSE, UNPIN_COURSE, FAVORITE_COURSES } from '../../data/queries'
import { parseMultiValue } from '../../util/input'

const CourseItem = ({course, ListView}) => {
    const {strings} = useContext(LanguageContext)
    const category = dummyCategories.find(cat => cat.id === course.categoryId)
    const {user, updateAuth, logout} = useContext(AuthContext)
    const [pinCourseGQL, mutationData] = useMutation(PIN_COURSE)
    const [unpinCourseGQL, unpinmutationData] = useMutation(UNPIN_COURSE)

    const [isPinned, setPinned] = useState(course.is_my_favorite)

    function truncate(str, no_words) {
      return str && str.split(" ").splice(0,no_words).join(" ");
    }
    let excerpt = truncate(course.description, 40)
    const [expanded, setExpanded] = useState(false) 
    //let pinnedClass = isPinned ? ' pinned' : ''

    const handlePinClick = (evt) => {
      const vars = {variables: {id: course.id}}

      if (isPinned) {
        unpinCourseGQL(vars).then(res => {
          setPinned(false)
        }).catch(err => {
          console.log(err)
        })
      } else {
        pinCourseGQL(vars).then(res => {
          setPinned(true)
        }).catch(err => {
          console.log(err)
        })
      }
    }

    return (
      <div className={'course-item masonry post-item course-summary ' + (expanded ? ' expanded' : '')}>
      <FadeIn transitionDuration={400} wrapperTag='span' className='fade-in'>
        <div className='post-item-wrap'>
          <div className='post-header'>
            <div className='post-title'>
              <span className='title-item'><Link to={"/learn/course/" + course.id}><h4>{course.title}</h4></Link></span> 
              <span className='title-item'>{course.organisation}</span>
              <span className='title-item'>{course.location}</span>
            </div>
            {ListView && 
            <div className='company-image'><img src={course.image_provider}/></div>
            }
            { user && 
            <div className='post-pin'>
                <button onClick={handlePinClick} className={"button icon-only" + (isPinned ? ' pinned' : '')}><PinIcon/></button>
            </div>
            }
          </div>
          {/* <img src={require('../../data/dummy/' + course.bannerImage)} alt=""/> */}
          {course.image_feature ? (
            <span className='post-image'><Link to={"/learn/course/" + course.id}><img src={course.image_feature}/></Link></span>
          ) : (
            <span className='post-image'><Link to={"/learn/course/" + course.id}><img src={require('../../data/dummy/img/banner.png')} alt=""/></Link></span>
          )}
          <div className='content'>
          <div className='description'>
              <p className="excerpt">{excerpt} ...</p>
          </div>
          <div className='post-meta'>
            <ul className='post-meta-list course-meta-list'>
                { course.category && 
                <li className='post-meta-item course-meta-item'><span>{strings.course.category}</span><b>{parseMultiValue(strings.categories, course.category)}</b></li>
                }
                { course.education_provider && 
                <li className='post-meta-item course-meta-item more-meta'><span>{strings.course.provider}</span><b>{course.education_provider}</b></li>
                }
                { course.city && 
                <li className='post-meta-item course-meta-item more-meta'><span>{strings.course.city}</span><b>{course.city}</b></li>
                }
                {course.start_date &&
                <li className='post-meta-item course-meta-item more-meta'><span>{strings.course.dates}</span><b>{`${formatDate(course.start_date)} - ${formatDate(course.end_date)}`}</b></li>
                }
                { course.hours && 
                <li className='post-meta-item course-meta-item more-meta'><span>{strings.course.hours}</span><b>{course.hours}</b></li>
                }
                {course.studypace &&
                <li className='post-meta-item course-meta-item more-meta'><span>{strings.course.pace}</span><b>{course.studypace}</b></li>
                }
                {course.language &&
                <li className='post-meta-item course-meta-item more-meta'><span>{strings.course.language}</span><b>{parseMultiValue(strings.languages, course.language)}</b></li>
                }
            </ul>
   
            <div className='columns-post'>
              { !ListView &&
                <div className='company-image'><img src={course.image_provider}/></div>
              }
              <Link to={"/learn/course/" + course.id} className='button link-button read-more'>{strings.course.more}</Link>
            </div>
            
            </div>
           </div>
          { ListView && 
            <div className='show-more' onClick={() => setExpanded(!expanded)}>
              <span>{strings.course.showMore}</span>
              <ArrowIcon />
            </div>
          }
        </div>
     </FadeIn>
    </div>
    )
}

export default CourseItem
