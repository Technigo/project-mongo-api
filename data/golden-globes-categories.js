/* eslint-disable no-console */
import goldenGlobesData from './golden-globes.json'

const allCategories = []
goldenGlobesData.forEach((item) => {
  if (allCategories.indexOf(item.category) === -1) {
    allCategories.push(item.category)
  }
})

const allCategoriesArray = allCategories.map((category) => {
  return { description: category }
})
export const categoriesJason = allCategoriesArray