import React from 'react'
import {useContext } from 'react'
import RequestItem from './RequestItem'
import {dummyRequests} from '../../data/dummy/requests'
import { LanguageContext } from '../../context/LanguageContext'
import { useQuery } from '@apollo/client'
import { INQUIRY_LIST } from '../../data/queries'

const RequestList = () => {
  const {strings} = useContext(LanguageContext)

  const {loading, data} = useQuery(INQUIRY_LIST)
  const inquiries = data?.inquiries.nodes
  return (
    <div className='request-list'>
      <div className='page-title'>
        <h2>{strings.request.listTitle}</h2>
      </div>
      {loading ? (
        <div>Loading</div>
      ) : (
        <>
        <div className='postgrid-2cols'>
          <div className='postgrid-col col-1'>
          {inquiries.map((request, i ) => (i%2 === 0) && (
            <RequestItem request={request} ListView={false} />
          ))}
          </div>
          <div className='postgrid-col col-2'>
          {inquiries.map((request, i ) => (i%2 === 1) && (
            <RequestItem request={request} ListView={false} />
          ))}
          </div>
        </div>
        {/* <button className="button button-b align-center">{strings.request.listAllButton}</button> */}
        </>
      )}
    </div>
  )
}

export default RequestList