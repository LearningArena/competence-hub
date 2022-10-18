import React from 'react'
import { useContext, useState } from 'react'
import FadeIn from 'react-fade-in'
import { Link, useLocation, useRouteMatch } from 'react-router-dom'
import { LanguageContext } from '../../context/LanguageContext'
import { dummyCategories } from '../../data/dummy/courses'
import { fields } from '../../data/fields'
import {
  BrowserView,
  MobileView,
  MobileOnlyView,
  isBrowser,
  isMobile,
  isMobileOnly
} from "react-device-detect"
import {ReactComponent as CatIcon} from '../../images/cat-icon.svg'

const CategoryItem = ({title, image, id}) => {
  let match = useRouteMatch()  
  

  const activeSuffix = (match.params.categoryId === id) ? ' active' : ''
  

  return (
  
    <div id={title} className={"cat-item" + activeSuffix}>
      <Link to={'/learn/category/' + id} className='cat-item-link'>
        <span className='cat-image'><img src={require('../../data/dummy/'+image)} alt={image} /></span>
        <span className='cat-title'><h3>{title}</h3></span>
      </Link>
    </div>
  )
}

const CategoryList = ({titleText, area, style}) => {
  //area: learn / educate
  //style: grid / gist
  const location = useLocation()
  const activeAllcats = (location.pathname === '/learn/utbildningar') ? ' active' : ''
  const {strings} = useContext(LanguageContext)
  const {categoriesList} = fields

const [openMobCats, setOpenMobCats] = useState('closed')
const toggleMobCats = () => {
  if(openMobCats === 'closed') {
    setOpenMobCats('opened')
  } else {
    setOpenMobCats('closed')
  }
}

  return (
    <>
    <div className={`wrap category-list-wrap ` + openMobCats}>
      <h2 className='centered-header'>{titleText}</h2>
      <div className={'category-list cats-' + area + ' liststyle-' + style}>
        <div className='cats-wrap'>
        <div id='all-cats' className={"cat-item" + activeAllcats}>
          <Link to={'/learn/utbildningar'} className='cat-item-link'>
             <span className='cat-image'><img src={require('../../data/dummy/img/ikon-all.svg')} alt="all-image"/></span>
      
            <span className='cat-title'><h3>Alla kategorier</h3></span>
           </Link>
        </div>
      
        {categoriesList.map(category => (
          <CategoryItem  key={category.slug} title={strings.categories[category.slug]} image={category.image} id={category.slug}/>
        ))}
        </div>
      </div>
    </div>
    {/* <MobileOnlyView>
     <button onClick={() => toggleMobCats()} className="toggle-cats">
          <CatIcon/><h4>Kategorier</h4>
    </button>
    </MobileOnlyView> */}
    </>
  )
}

export default CategoryList