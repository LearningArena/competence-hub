import React from 'react'
import { useContext } from 'react'
import { LanguageContext } from '../../context/LanguageContext'
import BackButton from './BackButton'
import Accordion from 'react-bootstrap/Accordion'
import AccordionContext from 'react-bootstrap/AccordionContext'
import { useAccordionToggle } from 'react-bootstrap/AccordionToggle';
import Card from 'react-bootstrap/Card'


const ReleasenotesItem = ({question, answer, eventKey, callback}) => {
    const currentEventKey = useContext(AccordionContext);
    const {strings} = useContext(LanguageContext)

  const decoratedOnClick = useAccordionToggle(
    eventKey,
    () => callback && callback(eventKey),
  );

  const isCurrentEventKey = currentEventKey === eventKey;
    return (
         <Card ID={eventKey} className={isCurrentEventKey ? 'opened' : ''}>
        {/* <Accordion.Toggle as={Card.Header} eventKey={eventKey}> */}
        <button onClick={decoratedOnClick} className='button' className='accordian-toggle-button'> 
            <h4><span className='light'><strong>{strings.releasenotes.releaseText}</strong> {question}</span></h4>
        </button>
        {/* </Accordion.Toggle> */}
        <Accordion.Collapse eventKey={eventKey}>
        <Card.Body>
            <span dangerouslySetInnerHTML={{__html : answer}} ></span>
        </Card.Body>
        </Accordion.Collapse>
        </Card>
    )
}

const ReleaseNotes = () => {
    const {strings} = useContext(LanguageContext)
    let thisKey;
    return (
      <div className='faq info-page'>
        <BackButton/>
        <h2>{strings.releasenotes.heading}</h2>
        <div className='content'>
        <Accordion defaultActiveKey="1">
        {strings.releasenotes.content.map((content, i) => (
            <div className='question-category-group'>
            {/* <h3>{content.category}</h3> */}
             {content.releasenotes.map((question, j) => (
                    thisKey = i.toString() + j.toString(),
                    <ReleasenotesItem className='listed-content' question={question.release} answer={question.content} eventKey={thisKey}/>
                ))}
            </div>
        ))}
        </Accordion>
        </div>   
      </div>
    )
  }
    
export default ReleaseNotes