import React from 'react'
import { useState } from 'react'
import { useContext } from 'react'
import { Link, useParams } from 'react-router-dom'
import { formatDate } from '../../util/date'
import { dummyCourses, dummyCategories } from '../../data/dummy/courses'
import {ReactComponent as ArrowIcon } from '../../images/icon_arrow.svg'
import { LanguageContext } from '../../context/LanguageContext'
import {ReactComponent as PinIcon } from '../../images/icon-pinned.svg'
import { getCategoryString } from '../../util/category'
import { parseMultiValue } from '../../util/input'

const RequestItem = ({request, ListView}) => {
    const {strings} = useContext(LanguageContext)
    const category = dummyCategories.find(cat => cat.id === request.categoryId)

    const [expanded, setExpanded] = useState(false)
  
    return (
      <div className='request-item post-item course-summary'>
      <div className='post-header'>
        <div className='post-title'>
          <span className='title-item date'>{formatDate(request.start_date)}</span> 
          <span className='title-item'><h4>{request.title}</h4></span> 
          <span className='title-item'>{request.organization?.name}</span>
          <span className='title-item location'>{request.location}</span>
        </div>
        {/* <div className='post-pin'>
            <button className="button icon-only"><PinIcon/></button>
        </div> */}
      </div>
    
      <div className='content'>
        <ul className='post-meta-list course-meta-list'>
           
              <li className='post-meta-item course-meta-item'><span>Sökt av</span><b>{request.organization?.name}</b></li>
            
            {request.category &&
               <li className='post-meta-item course-meta-item'><span>Kategori</span><b>{parseMultiValue(strings.categories, request.category)}</b></li>
            }
            {request.location &&
              <li className='post-meta-item course-meta-item'><span>Önsk. utbildningsort</span><b>{request.location}</b></li>
            }
            {request.start_date && 
              <li className='post-meta-item course-meta-item'><span>Önsk. studieperiod</span><span class='wish-date'><b>{formatDate(request.start_date)}-{formatDate(request.end_date)}</b></span></li>
            }
            {request.studypace && 
              <li className='post-meta-item course-meta-item'><span>Önsk. studietakt</span><b>{request.studypace}</b></li>
            }
            {request.language && 
              <li className='post-meta-item course-meta-item more-meta'><span>Önsk. studiespråk</span><b>{request.language}</b></li>
            }
        </ul>
         {/* <img src={require('../../data/dummy/' + course.bannerImage)} alt=""/> */}
      {request.organization?.image_logo ? (
        <span className='post-logo'><img src={request.organization.image_logo} /></span>
      ) : (
        <span className='post-logo'><img src='' alt=""/></span>
      )}
      </div>
      <div onClick={() => setExpanded(!expanded)} className='more-content' >
        <button  className={'show-more button' + (expanded ? ' expanded' : '')}>{strings.course.showMore}</button>
        <div className={'collapsed' + (expanded ? ' expanded' : '')}>
            <div className='collapsed-content'>
              <ul className=' post-meta-list post-authour-meta'>
                 <li className='post-meta-item author-meta-item'><h4>{request.contact}<span className='organisation'>{request.organization?.name}</span></h4></li>
                 {request.email_of_contact_person &&
                  <li className='post-meta-item course-meta-item'><span className='email'><a href={'mailto:' + request.email_of_contact_person}>{request.email_of_contact_person}</a></span></li>
                 }
                 <li className='post-meta-item course-meta-item'><span className=''>{request.phonenumber_of_contact_person}</span></li>
              </ul>
              <p class="description excerpt">{request.description} ...</p>
            </div>
        </div>
      </div>

    </div>
    )
}

export default RequestItem