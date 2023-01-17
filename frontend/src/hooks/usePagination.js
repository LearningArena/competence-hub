
import { useEffect, useContext, useState } from 'react'
import { useLazyQuery } from '@apollo/client';
import FilterItem from '../components/general/search/FilterItem';

export function usePagination(query, defaultNodeCount = 6, paginationContext) {

  const { ready, update, totalLoaded, setTotalLoaded, pageInfo, setPageInfo, pageNum, setPageNum, pageCursors, setPageCursors, activeFilters, isDescending, sortField, resetPagination } = useContext(paginationContext)

  // HACK: Always pass in the filter
  const dummyFilter = {title: {contains: ""}}
  const [fetchedData, setFetchedData] = useState({})

  const [lazyQuery, { loading, error, data }] = useLazyQuery(query, {
    fetchPolicy: 'network-only',
    onCompleted: data => {
      setFetchedData(data)
    }
  })

  useEffect(() => {
    if (!fetchedData.courses || !fetchedData.cursors) return
    setPageInfo(fetchedData.courses.pageInfo)
    const indicesLength = Math.floor(fetchedData.cursors.edges.length / defaultNodeCount) + 1;
    setPageCursors([...Array(indicesLength)].map((_, index) => fetchedData.cursors.edges[index * defaultNodeCount - 2]));
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

  const buildOrderQuery = ((sortField, isDescending) => {
    if (Array.isArray(sortField)) {
      let filterQuery = isDescending ? {[sortField.at(-1)]: "DESC"} : {[sortField.at(-1)]: "ASC"}
      sortField.slice(0,1).reverse().forEach((field) => 
        filterQuery = {[field]: filterQuery}
      )
      return [filterQuery]
    } else {
      return isDescending ? [{[sortField]: "DESC"}] : [{[sortField]: "ASC"}]
    }
  })

  const PaginationButton = (props) => {
    return <button key={props.page} className={'button ' + (pageNum == props.page ? 'inactive':'')} disabled={pageNum == props.page ? true : false} onClick={() => getPage(props.page, {variables: props.variables}).then(
      ({ loading, error, data }) => {
        props.updateFunc(data)
    })}>{ props.children }</button>
  }

  const PaginationControls = (props) => {
    const indices = Array.from(Array(pageCursors.length).keys())
    const firstThree = indices.slice(0, 3)
    const middleThree = indices.slice(pageNum >= 2 ? pageNum - 2 : 0, pageNum + 3)
    const lastThree = indices.slice(-3)
    const allButtons = [...new Set([...firstThree, ...middleThree, ...lastThree])]
    return (
      <div>
        { pageNum > 0 ? <PaginationButton page={pageNum-1} updateFunc={props.updateFunc}>{'<'}</PaginationButton> : <></>}
        {allButtons.map((val, i) => {
          return (
            <span key={i}>
              { allButtons[i]-allButtons[i-1] > 1 ? <span><strong>&nbsp;. . .&nbsp;</strong></span> : <></>}
              <PaginationButton page={val} variables={props.variables} updateFunc={props.updateFunc}>{ val+1 }</PaginationButton>
            </span>
          )
        })}
        { pageNum < indices[indices.length-1] ? <PaginationButton page={pageNum+1} updateFunc={props.updateFunc}>{'>'}</PaginationButton> : <></>}
      </div>
    )
  }

  useEffect(() => {
    update()
  })


  const getCurrent = ({ variables } = {}) => {
    return lazyQuery({ variables: { num: totalLoaded ? totalLoaded : defaultNodeCount, filters: Object.keys(activeFilters).length > 0 ? buildFilterQuery(activeFilters) : dummyFilter, order: buildOrderQuery(sortField, isDescending) , ...variables } })
  }

  const getPage = (pageNum, { variables } = {}) => {
    setPageNum(pageNum)
    return lazyQuery({ variables: { ...(pageNum != 0) && {after: pageCursors[pageNum].cursor}, num: defaultNodeCount, filters: Object.keys(activeFilters).length > 0 ? buildFilterQuery(activeFilters) : dummyFilter, order: buildOrderQuery(sortField, isDescending), ...variables } })
  }

  return { ready, PaginationControls, getCurrent, getPage, pageNum, setPageNum, pageCursors, resetPagination, totalLoaded, hasPrev: pageInfo.hasPreviousPage, hasNext: pageInfo.hasNextPage }
}

