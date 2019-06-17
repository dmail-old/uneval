/**
 * how do we ensure new Date(10) instead of Object.create(Date.prototype) ?
 * ->
 * bah si il a un chemin connu globalement on fait new ?
 * et sinon on fait Object.create ?
 * ou alors on tiens une liste qui dit que Date, String, Number ect
 * il faut faire new ?
 *
 * I guess we should store that it has a global constructor and use it instead
 * of Object.create. We'll use Object.create only for composite having
 * their prototype being Object.prototype at some point
 *
 * throw on Promise uneval too
 */

import { decompose } from "./decompose.js"
import { sortRecipes } from "./sort-recipes.js"
import { minifyRecipes } from "./minify-recipes.js"
import { recompose } from "./recompose.js"

export const uneval = (value) => {
  const { recipes, mainIdentifier } = decompose(value)

  const recipesSorted = sortRecipes(recipes)
  const recipesSortedAndMinified = minifyRecipes(recipesSorted)

  return recompose({ recipes: recipesSortedAndMinified, mainIdentifier })
}

uneval({ foo: true })
