import { gql, useQuery } from '@apollo/client'
import React from 'react'
import { useContext } from 'react'
import { useParams } from 'react-router-dom'
import ReactDOMServer from 'react-dom/server';
import { LanguageContext } from '../../context/LanguageContext'
import { COURSE_BY_ID } from '../../data/queries'
import { fields } from '../../data/fields'
import { ReactComponent as InvoiceIcon } from '../../images/icon-invoice.svg'
import { ReactComponent as LinkIcon } from '../../images/icon-link.svg'
import {ReactComponent as ArrowIcon } from '../../images/icon_arrow.svg'
import { formatDate } from '../../util/date'
import { useState } from 'react'
import { PopupContext } from '../../context/PopupContext'
import RequestInvoicePopup from './RequestInvoicePopup'
import { parseMultiValue } from '../../util/input'



export const CourseInformationById = () => {
  const {id} = useParams()

  const {loading, error, data} = useQuery(COURSE_BY_ID, {
    variables: {id: parseInt(id)},
  })
  const courseInfo = data && data.courses.nodes[0]

  return loading ? (
    <p>Loading</p>
  ) : error ? (
    <p>{console.log(error)}</p>
  ) : (
    <CourseInformation courseInfo={courseInfo} />
  )
}

const ImageButton = ({Icon, text, className, ...props}) => {
  const extraClasses = className ? ` ${className}` : ''
  return (
    <div className='image-button'>
      
      <button className={'button icon-button icon-only' + extraClasses} {...props}>
        <Icon/>
      </button>
      <h5>{text}</h5>
    </div>
  )
}

const ImageLink = ({Icon, text, linkTo, className, ...props}) => {
  const extraClasses = className ? ` ${className}` : ''
  return (
    <div className='image-button'>
      
      <a href={linkTo} className={'button icon-button icon-only' + extraClasses} {...props}>
        <Icon/>
      </a>
      <h5>{text}</h5>
    </div>
  )
}

const CourseInformation = ({courseInfo}) => {

  const {strings} = useContext(LanguageContext)
  const [isPinned, setPinned] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const {showPopup} = useContext(PopupContext)

  const levelMapping = {
    0: strings.course.levels.basic,
    1: strings.course.levels.medium,
    2: strings.course.levels.advanced,
  }
  const formatMapping = {
    0: strings.course.formats.onlocation,
    1: strings.course.formats.distance,
    2: strings.course.formats.eveningcourse,
    3: strings.course.formats.singleday,
    4: strings.course.formats.halfday,
    5: strings.course.formats.weekend,
    6: strings.course.formats.other,
  }


  const TitledItem = ({title, text, suffix}) => {
    if (text) {
    return (
      <li className='post-meta-item course-meta-item'>
        <strong>{title}</strong> {text}&nbsp;{suffix}
      </li>
    )
    } else {
    return (
      null
    )
    }
  }

  //Function to check if Child is empty
  const isChildNull = children => {
    return !Boolean(ReactDOMServer.renderToStaticMarkup(children));
  };

  
  const TitledItemGroup = ({groupTitle, children}) => {

 
    const isNull = isChildNull(children);
    

    if (isNull) { 
      return(null)
    } else {
      return (
       
        <div className="post-meta-group>">
          <h5>{groupTitle}</h5>
          <ul className='post-meta-list course-meta-list'>         
            { children }
          </ul>
        </div>
      )
    }
  }
  

  console.log(courseInfo)

  return (
    <div className='course-information'>
      <div className='title-bar'>
        <h4 className='centered-header'>{courseInfo.title}</h4>
        {/* <div className='pin'>
            <ImageButton onClick={() => setPinned(!isPinned)} Icon={PinIcon} className={isPinned ? 'pinned' : ''} />
        </div> */}
      </div>
      <div className='meta-container'>
        <div className='meta-left'>
          <div className='meta-icons'>
            {/* <ImageLink Icon={ShareIcon} text={strings.share} /> */}

            {courseInfo.name_of_contact_person && 
              <ImageButton Icon={InvoiceIcon} text={strings.requestInvoice } onClick={() => showPopup(<RequestInvoicePopup courseInfo={courseInfo}/>)} />
            }
            {courseInfo.link && 
              <ImageLink Icon={LinkIcon} text={strings.seeCourseExternal} linkTo={courseInfo.link} target='_blank'/>
            }
          </div>
          
          <ul className='post-meta-list course-meta-list'>
            <TitledItem title={strings.course.dates} text={`${formatDate(courseInfo.start_date)} - ${formatDate(courseInfo.end_date)}`} />
            <TitledItem title={strings.course.registerDate} text={formatDate(courseInfo.registration_end_date)} />
            <TitledItem title={strings.course.pace} text={courseInfo.studypace} />
            <TitledItem title={strings.course.city} text={courseInfo.city} />
            <TitledItem title={strings.course.category} text={parseMultiValue(strings.categories, courseInfo.category)} />
            <TitledItem title={strings.course.provider} text={courseInfo.education_provider} />
            <TitledItem title={strings.course.language} text={parseMultiValue(strings.languages, courseInfo.language)} />
            <TitledItem title={strings.course.import_source} text={fields.import_sources[courseInfo.import_source].name} />
          </ul>
          
        </div>
        <div className='meta-center'>
            <img className='feature-image' src={courseInfo.image_feature} alt=""/>
        </div>
        <div className='meta-right'>
            <img className='provider-image' src={courseInfo.image_provider} alt=""/>
        </div>  
      </div>
      <div className={'more-meta' + (expanded ? ' expanded' : '')}>
        <div className='show-more' onClick={() => setExpanded(!expanded)}>
        <span>{strings.course.showMore}</span>
        <ArrowIcon />
        </div>
        <div className='more-meta-content'>
              <TitledItemGroup groupTitle={strings.course.metatitleOne}>
                <TitledItem title={strings.course.hours} text={courseInfo.hours} />
                <TitledItem title={strings.course.credits} text={courseInfo.credits && courseInfo.credits.toLocaleString('sv')} />
                <TitledItem title={strings.course.level} text={levelMapping[courseInfo.level]} />
                <TitledItem title={strings.course.creditsprof} text={courseInfo.yrkeshogskolepoang} />
                <TitledItem title={strings.course.seqf} text={courseInfo.seqf} />
                <TitledItem title={strings.course.format} text={formatMapping[courseInfo.online]} />
                <TitledItem title={strings.course.certificates} text={courseInfo.diplomas} />
              </TitledItemGroup>
              <TitledItemGroup groupTitle={strings.course.metatitleTwo}>
                <TitledItem title={strings.course.literature} text={courseInfo.literature} />
                <TitledItem title={strings.course.tools} text={courseInfo.required_tools} />
                <TitledItem title={strings.course.prerequisites} text={courseInfo.prerequisite} />
              </TitledItemGroup>
              <TitledItemGroup groupTitle={strings.course.metatitleThree}>
                <TitledItem title={strings.course.cost} text={courseInfo.price} suffix={'SEK'}/>
                <TitledItem title={strings.course.verbs} text={courseInfo.verbs} />
                <TitledItem title={strings.course.teachers} text={courseInfo.teachers} />
                <TitledItem title={strings.course.teachersBio} text={courseInfo.bioteachers} />
              </TitledItemGroup>
              
          </div>
      </div>
      <div className='description-container'>  
        <strong className='course-intro'>{courseInfo.subtitle}</strong>
        <p className='course-description'>{courseInfo.description}</p>
      </div>
      <div className='course-contact'>
        <span className='contact-name'>
          <strong>{strings.course.contact}</strong>{courseInfo.name_of_contact_person}
        </span>
        
      
        
        <span className='contact-email'><strong>{strings.course.contactEmail}</strong><a href={'"mailto:' + courseInfo.email_of_contact_person + '"'}> {courseInfo.email_of_contact_person}</a></span>
      </div>
    </div>
  )
}

export default CourseInformation
