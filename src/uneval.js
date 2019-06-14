import { decompose } from "./decompose.js"

export const uneval = (value) => {
  const composition = decompose(value)
  debugger
  return produce(composition)
}

const produce = ({ recipes, mainRecipeIdentifier }) => {
  const values = recipes.map((recipe) => followRecipe(recipe, recipes))
  return values[mainRecipeIdentifier]
}

const followRecipe = (recipe, recipes) => {
  if (recipe.type === "primitive") return followPrimitiveRecipe(recipe)
  if (recipe.type === "global-reference") return followGlobalReferenceRecipe(recipe)
  return followCompositeRecipe(recipe, recipes)
}

const followPrimitiveRecipe = ({ value }) => value

const followGlobalReferenceRecipe = ({ globalPath }) => {
  let currentValue = typeof window === "object" ? window : global
  let i = 0
  while (i < globalPath.length) {
    const part = globalPath[i]
    i++
    if (part in currentValue === false) return undefined
    currentValue = currentValue[part]
  }
  return currentValue
}

const followCompositeRecipe = (
  { valueOfRecipeIdentifier, prototypeRecipeIdentifier, propertyRecipeArray, symbolRecipeArray },
  recipes,
) => {
  if (valueOfRecipeIdentifier) {
  }

  // how do we ensure recipe are followed in the right order ?
  // because there is a dependency order, prototype must be followed first
  // and property name, descriptor name before being able to set the descriptor value

  // how do we ensure new Date(10) instead of Object.create(Date.prototype) ?
  // I guess we should store that it has a global constructor and use it instead
  // of Object.create. We'll use Object.create only for composite having
  // their prototype being Object.prototype at some point

  // how do we follow property or symbol recipe because we must construct
  // the whole descriptor first

  // respect Object.preventExtension too

  const prototypeValue = followRecipe(recipes[prototypeRecipeIdentifier], recipes)
  const composite = Object.create(prototypeValue)

  propertyRecipeArray.forEach((propertyRecipe) => {
    const descriptor = {}
    const propertyName = followRecipe(recipes[propertyRecipe.propertyNameRecipeIdentifier], recipes)
    Object.defineProperty(composite, propertyName, descriptor)
  })

  symbolRecipeArray.forEach((symbolRecipe) => {
    const descriptor = {}
    const symbol = followRecipe(recipes[symbolRecipe.symbolRecipeIdentifier], recipes)
    Object.defineProperty(composite, symbol, descriptor)
  })

  return composite
}

uneval({ foo: true })
