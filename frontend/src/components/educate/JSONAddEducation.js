import React from 'react'
import { useRef } from 'react'
import { useState } from 'react'
import AddEducation from './AddEducation'

const JSONAddEducation = () => {



  const [files, setFiles] = useState([])
  const ref = useRef()

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



  return (
    <div>
      <form>
        <input ref={ref} type="file" onChange={handleChange}/>
        <button>Ladda upp</button>
      </form>
      <AddEducation jsonData={files[0]}/>
    </div>
  )
}

export default JSONAddEducation
