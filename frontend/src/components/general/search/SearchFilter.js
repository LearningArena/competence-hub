import React, { useContext, useEffect, useState, useRef } from 'react'
import { useHistory } from 'react-router-dom'
import { LanguageContext } from '../../../context/LanguageContext'
import { useQuery } from '@apollo/client'
import { LIST_EDUCATION_PROVIDERS, LIST_EDUCATION_LOCATIONS } from '../../../data/queries'
import FilterInput from './FilterInput'
import FilterItem from './FilterItem'
import FadeIn from 'react-fade-in'
import { fields } from '../../../data/fields'
import { PaginationContext } from '../../../context/PaginationContext'
import {
  BrowserView,
  MobileView,
  MobileOnlyView,
  isBrowser,
  isMobile,
  isMobileOnly
} from "react-device-detect"

  // https://thewebdev.info/2021/03/13/how-to-make-the-react-useeffect-hook-not-run-on-initial-render/
  const useDidMountEffect = (func, deps) => {
    const didMount = useRef(false);
  
    useEffect(() => {
      if (didMount.current) {
        func();
      } else {
        didMount.current = true;
      }
    }, deps);
  };

const SearchFilter = () => {

  const history = useHistory()

  const { activeFilters, setActiveFilters } = useContext(PaginationContext)

  const [filters, setFilters] = useState([])

  const {strings}  = useContext(LanguageContext)
  const {data: dataEducationProviders} = useQuery(LIST_EDUCATION_PROVIDERS)
  const {data: dataEducationLocations} = useQuery(LIST_EDUCATION_LOCATIONS)
  const {categoriesList} = fields

  useEffect(() => {
    if (history.location.state) {
      setFilters(history.location.state)
    }
  }, [])


  useEffect(() => {
    if (history.location.state) {
      setFilters(history.location.state)
    }
  }, [activeFilters])

  useDidMountEffect(() => {
    history.replace({}, filters)

    let aFilters = {}
    if (filters.length > 0) {
      //iterate all filters
      filters.forEach(filter => {
        if (filter.selected) {
          aFilters[filter.id] = []
          filter.selected.forEach(selected => {
            aFilters[filter.id].push(selected.value)

          })
        } 
      })
    }
    if (!deepEqual(aFilters, activeFilters)) {
      setActiveFilters(aFilters)
    }
  }, [filters])

  function deepEqual(object1, object2) {
    const keys1 = Object.keys(object1);
    const keys2 = Object.keys(object2);
    if (keys1.length !== keys2.length) {
      return false;
    }
    for (const key of keys1) {
      const val1 = object1[key];
      const val2 = object2[key];
      const areObjects = isObject(val1) && isObject(val2);
      if (
        areObjects && !deepEqual(val1, val2) ||
        !areObjects && val1 !== val2
      ) {
        return false;
      }
    }
    return true;
  }
  function isObject(object) {
    return object != null && typeof object === 'object';
  }

  const filterCategories = [
    {id:'category', name: strings.course.category, type: 'dropdown', items: categoriesList.map(cat => ({value: cat.slug, label: strings.categories[cat.slug]}))},
    {id:'language', name: strings.course.language, type: 'dropdown', items: [
      {value: 'SE', label: 'Svenska'},
      {value: 'GB', label: 'Engelska'},
    ]},
    {id:'city', name: strings.course.city, type: 'dropdown', items: dataEducationLocations?.course_locations.map(item => ({value:item, label:item}))},
    {id:'education_provider', name: strings.course.provider, type: 'dropdown', items: dataEducationProviders?.course_providers.map(item => ({value:item, label:item}))},
  ]

  const toggleFilter = (title) => {
    console.log('toggle', title)
    if (filters.some(e => title.name === e.name)) {
      setFilters(filters.filter(item => item.name !== title.name))
    } else {
      setFilters([...filters, title])
    }
  }
  
  if (isMobileOnly) {
    return (
      <div className='filter-search'>
        <div className='filter-wrapper'>
          <div className='filter-header'>
            <h3>{strings.search.filterHeader}</h3>
          </div>
          <ul className='filter-selector'>
            {filterCategories.map((item, index) => (
              <FilterInput key={index} strings={strings} filter={item} filters={filters} setFilters={setFilters} />
            ))}
          </ul>
        </div>
      </div>
    )
  } else {
  return (
    
    <div className='filter-search'>
      <div className='filter-wrapper'>
        <div className='filter-header'>
          <h3>{strings.search.filterHeader}</h3>
        </div>
        <ul className='filter-categories'>
          {filterCategories.map((item, index) => (
            <FilterItem key={index} title={item.name} active={filters.some(e => item.name === e.name)} toggleFilter={() => toggleFilter(item)} />
          ))}
        </ul>
        {filters.length > 0 &&
        <ul className='filter-selector'>
          {filters.map((filter,index) => (
            <FadeIn key={index}>
              <FilterInput strings={strings} filter={filter} filters={filters} setFilters={setFilters} />
            </FadeIn>
          ))}
        </ul>
        }
      </div>

    </div>
  )
  }
}

export default SearchFilter