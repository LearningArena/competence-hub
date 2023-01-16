import React from 'react'
import { useState } from 'react'
import { Form, SingleLineInput } from '../educate/FormInputs'
import PageBrand from './PageBrand'
import partner1 from '../../images/logos/gr-kompetensnav-2.png'
import riselogo from '../../images/rise_logo_rgb_pos.png'

const LandingPage = ({setAuthPassword}) => {

  const [password, setPassword] = useState({})
  const [errors, setErrors] = useState({})

  const handleSubmit = (evt) => {
    evt.preventDefault()
    console.log('submitting', password)
    //localStorage.setItem('authentication', password.password)
    localStorage.setItem('authentication', 'ocali')
    //if (password.password !== 'ocali') setErrors({password: 'Fel lösenord'})
    setAuthPassword('ocali')
  }

  return (
    <div className='landing-page'>
        <header className='page-header'>
         <div className='page-header-wrap sticky-child'>
            <PageBrand/>    
          </div>
        </header>
      <div className='page-content'>
        <h3>Hej!</h3>
        <p>
        Just nu kör vi en pilotfas av <b>kompetensmatchning.se</b>, sidan kommer strax öppna upp 
        för användning. <br></br>Om din organisation vill vara med och bidra med kursutbud redan nu 
        eposta <a href='mailto:kontakt@kompetensmatchning.se'>kontakt@kompetensmatchning.se</a>
        </p>
        
        <p>Vänligen</p>
        <p>Kompetensmatchingsteamet</p>
        <Form formData={password} setFormData={setPassword} errors={errors} onSubmit={handleSubmit}>
          {/* <SingleLineInput id='password' popupText={'Kontakta Olle Nyman på RISE för deltagning i denna piloten.'} type='password' text='Lösenord' placeholder='Skriv lösenord här' /> */}
          <button className='button button-a'>Fortsätt</button>
        </Form>
        
        <div className='page-footer'>
            <h3>Kompetensmatchning.se är ett samarbete mellan:</h3>
            <div className='logos'>
                <img src={riselogo} className='rise-logo-img'></img>
                <img src={partner1}></img>
            </div>
        </div>
        </div>
      </div>
  )
}

export default LandingPage
