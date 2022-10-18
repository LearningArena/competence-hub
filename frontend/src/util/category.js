import { fields } from "../data/fields"

export const parseCategory = (categoryString) => {
  return JSON.parse(categoryString)
}

export const getCategoryString = (strings, category) => {
  if (!category) return
  let res
  if (typeof(category) === 'string') {
    try {
      res = parseCategory(category)
    } catch {
      res = category
    }
  } else {
    res = category
  }

  if (typeof(res) === 'string') {
    return strings.categories[res]
  } else {
    return res.map(slug => strings.categories[slug]).join(', ')
  }
}
