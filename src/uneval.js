/**
 *
 * how do we ensure recipe are followed in the right order ?
 * because there is a dependency order, prototype must be followed first
 * and property name, descriptor name before being able to set the descriptor value
 * ->
 * il faut sorte les recipes
 * celle etant composite doivent arriver en dernier
 * et celle ayant un prototypeIdentifier doivent se trouver apres celuici
 * et celle ayant un valueOf apres celui ci aussi
 *
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
 */

import { decompose } from "./decompose.js"

export const uneval = (value) => {
  const composition = decompose(value)

  // donc ici il faut sorte recipes pour faire les prototypes en premier
  debugger
  return produce(composition)
}

const produce = ({ recipes, mainIdentifier }) => {
  const values = {}

  const followRecipe = (recipe) => {
    if (recipe.type === "primitive") return followPrimitiveRecipe(recipe)
    if (recipe.type === "global-symbol") return followGlobalSymbolRecipe(recipe)
    if (recipe.type === "global-reference") return followGlobalReferenceRecipe(recipe)
    return followCompositeRecipe(recipe, recipes)
  }

  const followPrimitiveRecipe = ({ value }) => value

  const followGlobalSymbolRecipe = ({ key }) => Symbol.for(key)

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

  const followCompositeRecipe = ({
    prototypeIdentifier,
    propertiesMap,
    symbolsMap,
    extensible,
  }) => {
    const prototypeValue = followRecipe(recipes[prototypeIdentifier])
    const composite = Object.create(prototypeValue)

    Object.keys(propertiesMap).forEach((propertyNameIdentifier) => {
      const propertyName = followRecipe(recipes[propertyNameIdentifier])
      const description = propertiesMap[propertyNameIdentifier]
      Object.defineProperty(composite, propertyName, producePropertyDescriptor(description))
    })

    Object.keys(symbolsMap).forEach((symbolIdentifier) => {
      const symbol = followRecipe(recipes[symbolIdentifier])
      const description = propertiesMap[symbolIdentifier]
      Object.defineProperty(composite, symbol, producePropertyDescriptor(description))
    })

    if (!extensible) Object.preventExtensions(composite)

    return composite
  }

  const producePropertyDescriptor = (description) => {
    const descriptor = {}
    Object.keys(description).forEach((descriptorNameIdentifier) => {
      const descriptorName = followRecipe(recipes[descriptorNameIdentifier])
      const descriptorValueIdentifier = followRecipe(description[descriptorNameIdentifier])
      descriptor[descriptorName] = descriptorValueIdentifier
    })
    return descriptor
  }

  recipes.forEach((recipe, index) => {
    const value = followRecipe(recipe, recipes)
    values[index] = value
  })

  return values[mainIdentifier]
}

uneval({ foo: true })
