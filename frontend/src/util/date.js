import { format, parseISO } from 'date-fns'

export const formatDate = (date) => {
  try {
    const resStr = format(parseISO(date), 'dd MMM yyyy')
    return resStr

  } catch (error) {
    //console.log(date, error)
  }
  return ''
}