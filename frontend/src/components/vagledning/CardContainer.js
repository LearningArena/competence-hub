import React, { createContext, useState, useContext, useEffect, useRef } from 'react';
import { wrapGrid } from 'animate-css-grid';
import '../../styles/vagledning.scss';

const AnimatingCardContext = createContext();

const Card = ({ id, title, description, otherData }) => {
  const { animatingCardId, setAnimatingCardId } = useContext(AnimatingCardContext);
  const [expanded, setExpanded] = useState(false);

  const handleClick = () => {
    setAnimatingCardId(id);
    setExpanded(!expanded);
  }

  const isAnimating = animatingCardId === id;

  return (
    <div className={`nc-card ${expanded ? 'expanded' : ''}`}>
      <div className={`${isAnimating ? 'hidden' : 'visible'}`}>
        <div className='card-content'>
          <h2>{title}</h2>
          <p>{description}</p>
          <div>{otherData}</div>
        </div>
        <button className="nc-card-button" onClick={handleClick}>
          {expanded ? 'Shrink' : 'Expand'}
        </button>
      </div>
    </div>
  );
}

const CardContainer = ({ cards }) => {
  const [animatingCardId, setAnimatingCardId] = useState(null);
  const gridRef = useRef();

 useEffect(() => {
  if (gridRef.current) {
    wrapGrid(gridRef.current, {
      stagger: 100,
      duration: 300,
      easing: "easeInOut",
      onStart: (animatingElementList) => {
        console.log("starting animation");
      },
      onEnd: (animatingElementList) => {
        console.log("ending animation");
        setAnimatingCardId(null);
      },
    });
  }
}, []);


  return (
    <AnimatingCardContext.Provider value={{ animatingCardId, setAnimatingCardId }}>
      <div className="nc-card-container" ref={gridRef}>
        {cards.map((card, index) => 
          <Card 
            key={index} 
            id={index}  // assuming index can be used as a unique identifier
            title={card.title} 
            description={card.description} 
            otherData={card.otherData} 
          />
        )}
      </div>
    </AnimatingCardContext.Provider>
  );
}

export default CardContainer;