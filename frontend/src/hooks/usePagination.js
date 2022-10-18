
import { useEffect, useContext, useState } from 'react'
import { useLazyQuery } from '@apollo/client';
import FilterItem from '../components/general/search/FilterItem';

export function usePagination(query, defaultNodeCount = 6, paginationContext) {

  const { ready, update, totalLoaded, setTotalLoaded, pageInfo, setPageInfo, activeFilters, isDescending, sortField, resetPagination } = useContext(paginationContext)

  // HACK: Always pass in the filter
  const dummyFilter = {title: {contains: ""}}
  const [fetchedData, setFetchedData] = useState({})

  const [lazyQuery, { loading, error, data }] = useLazyQuery(query, {
    onCompleted: data => {
      setFetchedData(data)
    }
  })

  useEffect(() => {
    if (!fetchedData.courses) return
    setPageInfo(fetchedData.courses.pageInfo)
    if (fetchedData.courses.pageInfo.hasPreviousPage) {
      setTotalLoaded(totalLoaded + fetchedData.courses.nodes.length)
    } else {
      setTotalLoaded(fetchedData.courses.nodes.length)
    }
  }, [fetchedData])

  const buildFilterQuery = ((filters) => {
    let filterQuery = {and: []}
    Object.entries(filters).forEach(([fCat, selected]) => {
      let filterCategory = {or: []}
      selected.forEach(fItem => {
        let filterItem = {[fCat]: {contains: fItem}}
        filterCategory.or.push(filterItem)
      })
      filterQuery.and.push(filterCategory)
    });
    return filterQuery
  })

  useEffect(() => {
    update()
  })


  const getCurrent = ({ variables } = {}) => {
    return lazyQuery({ variables: { num: totalLoaded ? totalLoaded : defaultNodeCount, filters: Object.keys(activeFilters).length > 0 ? buildFilterQuery(activeFilters) : dummyFilter, order: isDescending ? [{[sortField]: "DESC"}] : [{[sortField]: "ASC"}], ...variables } })
  }

  const getPrev = ({ variables } = {}) => {
    return lazyQuery({ variables: { before: pageInfo.startCursor, num: totalLoaded ? totalLoaded : defaultNodeCount, filters: Object.keys(activeFilters).length > 0 ? buildFilterQuery(activeFilters) : dummyFilter, order: isDescending ? [{[sortField]: "DESC"}] : [{[sortField]: "ASC"}], ...variables } })
  }

  const getNext = ({ variables } = {}) => {
    return lazyQuery({ variables: { after: pageInfo.endCursor, num: totalLoaded ? totalLoaded : defaultNodeCount, filters: Object.keys(activeFilters).length > 0 ? buildFilterQuery(activeFilters) : dummyFilter, order: isDescending ? [{[sortField]: "DESC"}] : [{[sortField]: "ASC"}], ...variables } })
  }

  return { ready, getCurrent, getPrev, getNext, resetPagination, totalLoaded, hasPrev: pageInfo.hasPreviousPage, hasNext: pageInfo.hasNextPage }
}

