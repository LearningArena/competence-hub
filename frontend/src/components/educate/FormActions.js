import {format, parseISO} from 'date-fns'
import { allEducationFields } from '../../data/queries'


const handleChange = (updateState, prevState, evt) => {
  updateState({...prevState, [evt.target.id]: evt.target.value})
}
const handleCheckboxChange = (updateState, prevState, evt) => {
  updateState({...prevState, [evt.target.id]: evt.target.checked})
}

const handleFileChange = (updateState, prevState, evt) => {
  console.log('uploading file!')
  let img = new Image()
  let id = evt.target.id
  img.onload = () => {
    let canvas = document.createElement('canvas')
    let ctx = canvas.getContext('2d')
    ctx.fillStyle = 'rgba(255,255,255,0)'
    ctx.fillRect(0,0,canvas.width,canvas.height)
    const maxWidth = 500
    const widthRatio = img.naturalWidth / maxWidth
    canvas.width = (widthRatio < 1) ? img.naturalWidth : maxWidth
    canvas.height = (widthRatio < 1) ? img.naturalHeight : img.naturalHeight / widthRatio
    console.log(canvas.width, canvas.height)
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
    const dataURL = canvas.toDataURL('image/png')
    console.log(dataURL)
    updateState({...prevState, [id]: dataURL})
  }
  if (evt.target.files[0]) img.src = URL.createObjectURL(evt.target.files[0])
}

const handleDateChange = (updateState, prevState, date, id) => {
  updateState({...prevState, [id]: date})
}

const handleDropdownChange = (updateState, prevState, evt, id) => {
  updateState({...prevState, [id]: evt})
}
const handleMultiDropdownChange = (updateState, prevState, evt, id) => {
  updateState(prev => {
    return {...prev, [id]: evt}
  })
}

const filterUnused = (obj) => {
  const filteredEntries = Object.entries(obj).filter(entry => entry[1] !== '-1' && entry[1] !== '' && entry[1] !== null && entry[1] !== undefined)
  const newObj = Object.fromEntries(filteredEntries)
  return newObj
}

const parseIntegers = (obj, integerFields) => {
  const parsedFields = Object.fromEntries(Object.entries(obj)
    .filter(entry => integerFields.includes(entry[0]))
    .map(entry => [entry[0],parseInt(entry[1])]))
  return {...obj, ...parsedFields}
}
const parseDates = (obj, dateFields) => {
  const parsedFields = Object.fromEntries(Object.entries(obj)
    .filter(entry => dateFields.includes(entry[0]))
    .map(entry => [entry[0],parseISO(entry[1])]))
  return {...obj, ...parsedFields}
}
const formatDates = (obj, dateFields) => {
  const parsedFields = Object.fromEntries(Object.entries(obj)
    .filter(entry => dateFields.includes(entry[0]))
    .map(entry => [entry[0],format(entry[1],'yyyy-MM-dd') + 'T00:00Z']))
  return {...obj, ...parsedFields}
}
const formatDropdown = (obj, dropdownFields) => {
  const parsedFields = Object.fromEntries(Object.entries(obj)
    .filter(entry => dropdownFields.includes(entry[0]))
    .map(entry => [entry[0], entry[1].value]))
  return {...obj, ...parsedFields}
}
const formatMultiDropdown = (obj, dropdownFields) => {
  const parsedFields = Object.fromEntries(Object.entries(obj)
    .filter(entry => dropdownFields.includes(entry[0]))
    .map(entry => [entry[0], JSON.stringify(Array.isArray(entry[1]) && entry[1].map(item => item.value))]))
  return {...obj, ...parsedFields}
}
const parseFloats = (obj, floatFields) => {
  const parsedFields = Object.fromEntries(Object.entries(obj)
    .filter(entry => floatFields.includes(entry[0]))
    .map(entry => {
      console.log(entry);
      if (entry[1].replace)
        return [entry[0],entry[1].replace(',','.')]
      else
        return [entry[0],entry[1]]
    })
    .map(entry => [entry[0],parseFloat(entry[1])]))
  return {...obj, ...parsedFields}
}
const formatFloats = (obj, floatFields) => {
  const parsedFields = Object.fromEntries(Object.entries(obj)
    .filter(entry => floatFields.includes(entry[0]))
    .map(entry => [entry[0],entry[1].toLocaleString('sv')]))
  return {...obj, ...parsedFields}
}

const formatFormData = (formData, options) => {
  if (!formData) return
  let res = {...formData}
  res = filterUnused(res)
  res = options?.dropdownFields ? formatDropdown(res, options.dropdownFields) : res
  res = options?.integerFields ? parseIntegers(res, options.integerFields) : res
  res = options?.floatFields ? parseFloats(res, options.floatFields) : res
  res = options?.dateFields ? formatDates(res, options.dateFields) : res
  res = options?.multiDropdownFields ? formatMultiDropdown(res, options.multiDropdownFields) : res
  return res
  //formatMultiDropdown(formatDates(parseIntegers(formatDropdown(filterUnused(joinLanguages(formData))))))
}

const jsonToDropdown = (json) => {
  if (!json) return
  const obj = JSON.parse(json)

  console.log(typeof(obj))

  return obj.map(val => ({label: val, value: val}))
}

export const formActions = {
  handleChange,
  handleCheckboxChange,
  handleFileChange,
  handleMultiDropdownChange,
  handleDateChange,
  filterUnused,
  parseIntegers,
  parseDates,
  formatDates,
  formatDropdown,
  formatFloats,
  formatMultiDropdown,
  formatFormData,
  jsonToDropdown
}