/**
 * throw on Promise, Function, getter, setter
 * WeakMap, Map we could restore Map and WeakMap using their methods to collect
 * data inside them and restore them afterwards.
 */

import { decompose } from "./decompose.js"
import { compositionToRecipe } from "./composition-to-recipe.js"
import { minifyRecipe } from "./minify-recipe.js"
import { recompose } from "./recompose.js"
import { escapeString } from "./escapeString.js"

export const uneval = (value) => {
  const composition = decompose(value)
  const recipe = compositionToRecipe(composition)
  const recipeMinified = minifyRecipe(recipe)
  const recomposeSource = recompose.toString()
  const recomposeParamSouce = recipeToSource(recipeMinified)

  return `(${recomposeSource})(${recomposeParamSouce})`
}

const recipeToSource = (recipe) => {
  const valueToSource = (value) => {
    if (value instanceof Array) return arrayToSource(value)
    if (value instanceof RegExp) return value.toString()
    if (value === null) return "null"
    if (typeof value === "object") return objectToSource(value)
    if (typeof value === "string") return `"${escapeString(value)}"`
    if (Object.is(value, -0)) return "-0"
    return String(value)
  }

  const arrayToSource = (array) => {
    const valueSourceArray = array.map((value) => valueToSource(value))
    return `[${valueSourceArray.join(",")}]`
  }

  const objectToSource = (object) => {
    const propertiesSources = Object.keys(object).map((key) => {
      return `"${escapeString(key)}":${valueToSource(object[key])}`
    })
    return `{${propertiesSources.join(",")}}`
  }

  return valueToSource(recipe)
}
