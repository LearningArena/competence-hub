
export const parseMultiValue = (stringTable, value) => {
  if (!value) return
  let res
  if (typeof(value) === 'string') {
    try {
      res = JSON.parse(value)
    } catch {
      res = value
    }
  } else {
    res = value
  }

  if (typeof(res) === 'string') {
    return stringTable?.[res] ?? res
  } else {
    return res.map(slug => stringTable[slug]).join(', ')
  }
}

export const makeMultiValue = (stringTable, value) => {
  let res
  try {
    res = value && JSON.parse(value)?.map(slug => ({label: stringTable[slug], value: slug}))
  } catch (err) {
    console.log(err, value)
  }
  return res
}