/**
 * transforms a javascript value into an object describing it.
 *
 */

import { isComposite } from "./is-composite.js"
import { getCompositeGlobalPath, getPrimitiveGlobalPath } from "./global-value-path.js"

export const decompose = (mainValue) => {
  const values = []
  const recipes = []

  const valueToIdentifier = (value) => {
    if (!isComposite(value)) {
      const existingIdentifier = identifierForPrimitive(value)
      if (existingIdentifier !== undefined) return existingIdentifier
      const identifier = nextIdentifier(value)
      recipes[identifier] = primitiveToRecipe(value)
      return identifier
    }

    const existingIdentifier = identifierForComposite(value)
    if (existingIdentifier !== undefined) return existingIdentifier
    const identifier = nextIdentifier(value)

    const compositeGlobalPath = getCompositeGlobalPath(value)
    if (compositeGlobalPath) {
      recipes[identifier] = createGlobalReferenceRecipe(compositeGlobalPath)
      return identifier
    }

    const recipe = {
      type: "composite",
      valueOfIdentifier: undefined,
      prototypeIdentifier: undefined,
      propertiesMap: undefined,
      symbolsMap: undefined,
    }

    // properties
    const propertyNames = Object.getOwnPropertyNames(value)
    if (propertyNames.length > 0) {
      const propertiesMap = {}
      Object.getOwnPropertyNames(value).forEach((propertyName) => {
        const propertyNameIdentifier = valueToIdentifier(propertyName)
        const propertyDescriptor = Object.getOwnPropertyDescriptor(value, propertyName)
        const propertyDescription = {}
        Object.keys(propertyDescriptor).forEach((descriptorName) => {
          const descriptorNameIdentifier = valueToIdentifier(descriptorName)
          const descriptorValueIdentifier = valueToIdentifier(propertyDescriptor[descriptorName])
          propertyDescription[descriptorNameIdentifier] = descriptorValueIdentifier
        })
        propertiesMap[propertyNameIdentifier] = propertyDescription
      })
      recipe.propertiesMap = propertiesMap
    }

    // symbols
    const symbols = Object.getOwnPropertySymbols(value)
    if (symbols.length > 0) {
      const symbolsMap = {}
      symbols.forEach((symbol) => {
        const symbolIdentifier = valueToIdentifier(symbol)
        const propertyDescriptor = Object.getOwnPropertyDescriptor(value, symbol)
        const propertyDescription = {}
        Object.keys(propertyDescriptor).forEach((descriptorName) => {
          const descriptorNameIdentifier = valueToIdentifier(descriptorName)
          const descriptorValueIdentifier = valueToIdentifier(propertyDescriptor[descriptorName])
          propertyDescription[descriptorNameIdentifier] = descriptorValueIdentifier
        })
        symbolsMap[symbolIdentifier] = propertyDescription
      })
      recipe.symbolsMap = symbolsMap
    }

    // valueOf, mandatory to uneval new Date(10) for instance.
    if ("valueOf" in value && typeof value.valueOf === "function") {
      const valueOfReturnValue = value.valueOf()
      if (isComposite(valueOfReturnValue)) {
        if (valueOfReturnValue !== value)
          throw new Error(createUnexpectedValueOfReturnValueErrorMessage())
      } else {
        recipe.valueOfIdentifier = valueToIdentifier(valueOfReturnValue)
      }
    }

    // prototype, important to keep after properties and symbols
    // because prototype may be specified inside properties or symbols
    const prototypeValueToIdentifier = (prototypeValue) => {
      // prototype is null
      if (prototypeValue === null) return valueToIdentifier(prototypeValue)

      // prototype found somewhere already
      const prototypeIndex = values.indexOf(prototypeValue)
      if (prototypeIndex > -1) return prototypeIndex

      // make prototype as visited
      const prototypeIdentifier = nextIdentifier(prototypeValue)

      // prototype is a global reference ?
      const prototypeGlobalPath = getCompositeGlobalPath(prototypeValue)
      if (prototypeGlobalPath) {
        recipes[prototypeIdentifier] = createGlobalReferenceRecipe(prototypeGlobalPath)
        return prototypeIdentifier
      }

      // otheriwse prototype is unexpected
      throw new Error(createUnexpectedPrototypeErrorMessage({ prototypeValue }))
    }
    recipe.prototypeIdentifier = prototypeValueToIdentifier(Object.getPrototypeOf(value))

    if (!Object.isExtensible(value)) {
      recipe.extensible = false
    }

    recipes[identifier] = recipe
    return identifier
  }

  const identifierForPrimitive = (value) => {
    const existingPrimitiveIndex = values.findIndex((existingValue) => {
      if (Object.is(value, existingValue)) return true
      return value === existingValue
    })
    if (existingPrimitiveIndex === -1) return undefined
    return existingPrimitiveIndex
  }

  const identifierForComposite = (value) => {
    const existingCompositeIndex = values.indexOf(value)
    if (existingCompositeIndex === -1) return undefined
    return existingCompositeIndex
  }

  const nextIdentifier = (value) => {
    const identifier = values.length
    values.push(value)
    return identifier
  }

  const mainIdentifier = valueToIdentifier(mainValue)
  return {
    recipes,
    mainIdentifier,
  }
}

const primitiveToRecipe = (value) => {
  if (typeof value === "symbol") return symbolToRecipe(value)

  return {
    type: "primitive",
    value,
  }
}

const symbolToRecipe = (symbol) => {
  const globalSymbolKey = Symbol.keyFor(symbol)
  if (globalSymbolKey !== undefined) {
    return {
      type: "global-symbol",
      key: globalSymbolKey,
    }
  }

  const symbolGlobalPath = getPrimitiveGlobalPath(symbol)
  if (!symbolGlobalPath) throw new Error(createUnexpectedSymbolErrorMessage({ symbol }))

  return {
    type: "global-reference",
    globalPath: symbolGlobalPath,
  }
}

const createGlobalReferenceRecipe = (globalPath) => {
  const recipe = {
    type: "global-reference",
    globalPath,
  }
  return recipe
}

const createUnexpectedValueOfReturnValueErrorMessage = () =>
  `valueOf() must return a primitive of the object itself.`

const createUnexpectedSymbolErrorMessage = ({ symbol }) => `symbol must be a well known symbol.
symbol: ${symbol}`

const createUnexpectedPrototypeErrorMessage = () =>
  `prototype must be global, like Object.prototype, or somewhere in the value.`
