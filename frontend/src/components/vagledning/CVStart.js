import React, { useState } from 'react'
import CVForm from './CVForm'


const CVMain = () => {

  const [formData, setFormData] = useState()

  const handleSubmit = (evt) => {
    evt.preventDefault()
    console.log("We are submitting with CVStart")
  }

  return (
    <>
      <div className='learn-start'>
        <CVForm formData={formData} setFormData={setFormData} submitForm={handleSubmit} />
      </div>
    </>
  )
}

export default CVMain
