import { useMutation, useQuery } from '@apollo/client'
import React from 'react'
import { useContext } from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { AuthContext } from '../../context/AuthContext'
import { LanguageContext } from '../../context/LanguageContext'
import { PopupContext } from '../../context/PopupContext'
import { COURSE_ADD_OWNER, COURSE_OWNERS, ORG_USERS } from '../../data/queries'
import { DropdownInput, Form } from './FormInputs'

const AddEducationOwnerPopup = ({course}) => {

  const {strings} = useContext(LanguageContext)
  const {hidePopup} = useContext(PopupContext)
  const {organization} = useContext(AuthContext)
  const {data} = useQuery(ORG_USERS, {variables: {id: organization.id}})
  const [addOwnerGQL, mutationData] = useMutation(COURSE_ADD_OWNER, {refetchQueries: [
    {query: COURSE_OWNERS, variables: {id:course.id}}
  ]})
  const {data: ownerData} = useQuery(COURSE_OWNERS, {variables: {id:course.id}})
  //const users = data?.users ?? []
  const [users, setUsers] = useState([])
  const [owners, setOwners] = useState([])
  const [usersExceptOwners, setUsersExceptOwners] = useState([])
  const [formData, setFormData] = useState({})


  useEffect(() => {
    setUsers(data?.users?.nodes ?? [])
  }, [data])
  // useEffect(() => {
  //   console.log(formData)
  // }, [formData])
  useEffect(() => {
    setOwners(ownerData?.users?.nodes ?? [])
  }, [ownerData])
  useEffect(() => {
    setUsersExceptOwners(users.filter(user => {
      return !owners.some(owner => {
        console.log("Setting", user.id, owner.id)
        return owner.id === user.id
      })
    }))
  }, [users, owners])

  const handleChange = (evt) => {
    const selectedUser = users.find(user => {
      return user.id == evt.value
    })
    const label = selectedUser.firstname + ' ' + selectedUser.lastname
    setFormData({new_user_id: {...evt, label}})
  }

  const handleCancel = (evt) => {
    evt.preventDefault()
    hidePopup()
  }

  const handleSubmit = (evt) => {
    evt.preventDefault()
    const params = {new_user_id: formData.new_user_id.value, course_id: course.id}
    console.log(params)
    addOwnerGQL({variables: params}).then(res => {
      console.log(res)
    }).catch(err => {
      console.log(err)
    })
  }

  return (
    <div className='confirm-delete-course-popup'>
    <div className='title'>
    <h4>{strings.popup.AddEducationOwnerPopup.title} {course.title}</h4>
    </div>
    <h5>{strings.popup.AddEducationOwnerPopup.owner}</h5>
    <ul>
      {owners.map((user) => (
        <li key={user.username}>{user.firstname} {user.lastname}, {user.username}</li>
      ))}
    </ul>
    <Form formData={formData} setFormData={setFormData} onSubmit={handleSubmit}>
      <DropdownInput isSearchable onChange={handleChange} id='new_user_id' text='Användare' items={usersExceptOwners.map(user => (
        {value: user.id,
         text: `${user.firstname} ${user.lastname}${user.email ? (', ' + user.email) : ''}`}
      ))} />
      <div className= 'button-box'>
      <button onClick={handleCancel} className='button'>{strings.popup.AddEducationOwnerPopup.cancel}</button>
      <button className='button'>{strings.popup.AddEducationOwnerPopup.save}</button>
      </div>
    </Form>
    </div>
  )
}

export default AddEducationOwnerPopup
