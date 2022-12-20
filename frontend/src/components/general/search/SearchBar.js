import React from 'react'
import { useContext } from 'react'
import { useState } from 'react'
import { useHistory, useLocation, useParams, useRouteMatch } from 'react-router-dom'
import { LanguageContext } from '../../../context/LanguageContext'
import {ReactComponent as SearchIcon} from '../../../images/icon-magnifier.svg'

const SearchBar = ({placeHolderText}) => {

  const query = useParams()?.query
  const [searchQuery, setSearchQuery] = useState(query ?? '')
  const history = useHistory()
  const {strings} = useContext(LanguageContext)
  let match = useRouteMatch()

  const handleSubmit = (evt) => {
    evt.preventDefault()
    if (!searchQuery){
      return;
    }
    console.log(searchQuery)
    history.push(`/learn/search/${searchQuery}`)
  }

  const handleChange = (evt) => {
    setSearchQuery(evt.target.value)
  }

  return (
    <div className='search-bar-container'>
      <form className='search-bar' onSubmit={handleSubmit}>
        <input type='text' value={searchQuery} placeholder={placeHolderText} onChange={handleChange}></input>
        <button className='button active'><SearchIcon /></button>
      </form>
    </div>
  )
}

export default SearchBar
