import React, { useEffect } from 'react'
import { useState } from 'react'
import { createContext } from 'react'
import { useLocation } from 'react-router-dom';

export const PaginationContext = createContext()

const PaginationContextProvider = (props) => {

  const location = useLocation()

  const [ready, setReady] = useState(false)
  const [path, setPath] = useState("")
  const [totalLoaded, setTotalLoaded] = useState(0)
  const [pageInfo, setPageInfo] = useState({})
  const [pageNum, setPageNum] = useState(0)
  const [pageCursors, setPageCursors] = useState([])
  const [variables, setVariables] = useState({})

  //Filter
  const [activeFilters, setActiveFilters] = useState({})

  //Sort
  const [isListView, setListView] = useState(false)  
  const [isDescending, setDescending] = useState(false)  
  const [sortField, setSortField] = useState('id')

  const resetPagination = () => {
    setTotalLoaded(0)
    setPageInfo({})
    setPageNum(0)
    setPageCursors([])
    setVariables({})
  }

  const resetFiltersSorting = () => {
    setActiveFilters({})
    setListView(false)
    setDescending(false)
    setSortField('id')
  }

  const update = () => {
    let newPath = location.pathname
    if (newPath !== path) {
      resetFiltersSorting()
      setReady(false)
      setPath(newPath)
    }
  }

  useEffect(() => {
    if (ready) return 
    resetPagination()
    setReady(true)
  })

  useEffect(() => {
    setReady(false)
  }, [activeFilters, isDescending, sortField])


  return (
    <PaginationContext.Provider value={{ ready, update, totalLoaded, setTotalLoaded, pageInfo, variables, setVariables, setPageInfo, pageNum, setPageNum, pageCursors, setPageCursors,
    activeFilters, setActiveFilters, isListView, setListView, isDescending, setDescending, sortField, setSortField }}>
      {props.children}
    </PaginationContext.Provider>
  )
}

export default PaginationContextProvider
