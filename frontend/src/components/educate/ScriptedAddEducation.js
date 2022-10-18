import { useMutation } from '@apollo/client'
import React from 'react'
import { useRef } from 'react'
import { useState } from 'react'
import { ADD_EDUCATION } from '../../data/queries'

const ScriptedAddEducation = () => {

  const [files, setFiles] = useState([])
  const ref = useRef()
  const [addEducationGQL, mutationData] = useMutation(ADD_EDUCATION)

  const handleSubmit = async (evt) => {
    evt.preventDefault()
    files.forEach(file => {
      addEducationGQL({variables: file}).then(res => {
        console.log(res)
      }).catch(err => {
        console.log(err)
      })
    })
    console.log(files)
  }

  const handleChange = (e) => {
    const inputFiles = Array.from(e.target.files)
    console.log(inputFiles)
    inputFiles.forEach((element => {
      var reader = new FileReader();
      reader.onload = function(event) {
        const json = JSON.parse(event.target.result)
        setFiles(prevFiles => [...prevFiles, json])
      };
      reader.readAsText(element);
    }));
  }

  const clearFiles = () => {
    ref.current.value = ''
    setFiles([])
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input ref={ref} type="file" multiple onChange={handleChange}/>
        <button>Ladda upp</button>
      </form>
      <button onClick={clearFiles}>Rensa filer</button>
        {files.map(file =>
        <ul style={{margin:'1em'}}>
          <h5>{file.title}</h5>
          {Object.entries(file).map(entry => (
          <li>
            <span><b>{entry[0]}: </b></span>
            <span>{entry[1]}</span>
          </li>
          ))}
        </ul>
        )}
    </div>
  )
}

export default ScriptedAddEducation
