/**
 * transforms a javascript value into an object describing it.
 *
 */

import { isComposite } from "./is-composite.js"
import { getCompositeGlobalPath, getPrimitiveGlobalPath } from "./global-value-path.js"

export const decompose = (mainValue, { functionAllowed }) => {
  const valueMap = {}
  const recipeArray = []

  const valueToIdentifier = (value, path = []) => {
    if (!isComposite(value)) {
      const existingIdentifier = identifierForPrimitive(value)
      if (existingIdentifier !== undefined) return existingIdentifier
      const identifier = identifierForNewValue(value)
      recipeArray[identifier] = primitiveToRecipe(value)
      return identifier
    }

    if (typeof value === "function") {
      if (!functionAllowed) throw new Error(createForbiddenFunctionErrorMessage({ path }))
      // when allowed, the function source should be stored
      // as we do for regex for instance.
      // the idea it to avoid having to do new Function on every function
      // the function source will be stored like for the regex
      // it means a composite which is a function
      // doesn't have to do something like Object.create or new Function
      // it will start from the valueOfIdentifier that is already a composite
      // (we could do that for regex too by the way)
    }

    const existingIdentifier = identifierForComposite(value)
    if (existingIdentifier !== undefined) return existingIdentifier
    const identifier = identifierForNewValue(value)

    const compositeGlobalPath = getCompositeGlobalPath(value)
    if (compositeGlobalPath) {
      recipeArray[identifier] = createGlobalReferenceRecipe(compositeGlobalPath)
      return identifier
    }

    const propertiesDescription = {}
    Object.getOwnPropertyNames(value).forEach((propertyName) => {
      const propertyDescriptor = Object.getOwnPropertyDescriptor(value, propertyName)
      const propertyDescription = {}
      Object.keys(propertyDescriptor).forEach((descriptorName) => {
        const descriptorNameIdentifier = valueToIdentifier(descriptorName, [
          ...path,
          propertyName,
          `[[${descriptorName}]]`,
        ])
        const descriptorValueIdentifier = valueToIdentifier(propertyDescriptor[descriptorName], [
          ...path,
          propertyName,
          `[[${descriptorName}]]`,
          "value",
        ])
        propertyDescription[descriptorNameIdentifier] = descriptorValueIdentifier
      })
      const propertyNameIdentifier = valueToIdentifier(propertyName, [...path, propertyName])
      propertiesDescription[propertyNameIdentifier] = propertyDescription
    })

    const symbolsDescription = {}
    Object.getOwnPropertySymbols(value).forEach((symbol) => {
      const propertyDescriptor = Object.getOwnPropertyDescriptor(value, symbol)
      const propertyDescription = {}
      Object.keys(propertyDescriptor).forEach((descriptorName) => {
        const descriptorNameIdentifier = valueToIdentifier(descriptorName, [
          ...path,
          symbol,
          `[[${descriptorName}]]`,
        ])
        const descriptorValueIdentifier = valueToIdentifier(propertyDescriptor[descriptorName], [
          ...path,
          symbol,
          `[[${descriptorName}]]`,
          "value",
        ])
        propertyDescription[descriptorNameIdentifier] = descriptorValueIdentifier
      })
      const symbolIdentifier = valueToIdentifier(symbol, [...path, symbol])
      symbolsDescription[symbolIdentifier] = propertyDescription
    })

    // valueOf, mandatory to uneval new Date(10) for instance.
    const valueOfIdentifier = identifierForValueOfReturnValue(value, path)

    const extensible = Object.isExtensible(value)

    recipeArray[identifier] = createCompositeRecipe({
      valueOfIdentifier,
      propertiesDescription,
      symbolsDescription,
      extensible,
    })
    return identifier
  }

  const identifierForValueOfReturnValue = (value, path) => {
    if (value instanceof RegExp) {
      const valueOfIdentifier = nextIdentifier()
      recipeArray[valueOfIdentifier] = {
        type: "primitive",
        value,
      }
      return valueOfIdentifier
    }

    if (value instanceof Array) return valueToIdentifier(value.length, [...path, "length"])

    if ("valueOf" in value === false) return undefined

    if (typeof value.valueOf !== "function") return undefined

    const valueOfReturnValue = value.valueOf()
    if (!isComposite(valueOfReturnValue))
      return valueToIdentifier(valueOfReturnValue, [...path, "valueOf()"])

    if (valueOfReturnValue === value) return undefined

    throw new Error(createUnexpectedValueOfReturnValueErrorMessage())
  }

  const identifierForPrimitive = (value) => {
    return Object.keys(valueMap).find((existingIdentifier) => {
      const existingValue = valueMap[existingIdentifier]
      if (Object.is(value, existingValue)) return true
      return value === existingValue
    })
  }

  const identifierForComposite = (value) => {
    return Object.keys(valueMap).find((existingIdentifier) => {
      const existingValue = valueMap[existingIdentifier]
      return value === existingValue
    })
  }

  const identifierForNewValue = (value) => {
    const identifier = nextIdentifier()
    valueMap[identifier] = value
    return identifier
  }

  let currentIdentifier = -1
  const nextIdentifier = () => {
    const identifier = String(parseInt(currentIdentifier) + 1)
    currentIdentifier = identifier
    return identifier
  }

  const mainIdentifier = valueToIdentifier(mainValue)

  // prototype, important to keep after the whole structure was visited
  // so that we discover if any prototype is part of the value
  const prototypeValueToIdentifier = (prototypeValue) => {
    // prototype is null
    if (prototypeValue === null) return valueToIdentifier(prototypeValue)

    // prototype found somewhere already
    const prototypeExistingIdentifier = identifierForComposite(prototypeValue)
    if (prototypeExistingIdentifier !== undefined) return prototypeExistingIdentifier

    // mark prototype as visited
    const prototypeIdentifier = identifierForNewValue(prototypeValue)

    // prototype is a global reference ?
    const prototypeGlobalPath = getCompositeGlobalPath(prototypeValue)
    if (prototypeGlobalPath) {
      recipeArray[prototypeIdentifier] = createGlobalReferenceRecipe(prototypeGlobalPath)
      return prototypeIdentifier
    }

    // otherwise prototype is unexpected
    throw new Error(createUnexpectedPrototypeErrorMessage({ prototypeValue }))
  }
  recipeArray.slice().forEach((recipe, index) => {
    if (recipe.type === "composite") {
      const prototypeValue = Object.getPrototypeOf(valueMap[index])
      recipe.prototypeIdentifier = prototypeValueToIdentifier(prototypeValue)
    }
  })

  return {
    recipeArray,
    mainIdentifier,
  }
}

const primitiveToRecipe = (value) => {
  if (typeof value === "symbol") return symbolToRecipe(value)

  return createPimitiveRecipe(value)
}

const symbolToRecipe = (symbol) => {
  const globalSymbolKey = Symbol.keyFor(symbol)
  if (globalSymbolKey !== undefined) return createGlobalSymbolRecipe(globalSymbolKey)

  const symbolGlobalPath = getPrimitiveGlobalPath(symbol)
  if (!symbolGlobalPath) throw new Error(createUnexpectedSymbolErrorMessage({ symbol }))

  return createGlobalReferenceRecipe(symbolGlobalPath)
}

const createPimitiveRecipe = (value) => {
  return {
    type: "primitive",
    value,
  }
}

const createGlobalReferenceRecipe = (path) => {
  const recipe = {
    type: "global-reference",
    path,
  }
  return recipe
}

const createGlobalSymbolRecipe = (key) => {
  return {
    type: "global-symbol",
    key,
  }
}

const createCompositeRecipe = ({
  prototypeIdentifier,
  valueOfIdentifier,
  propertiesDescription,
  symbolsDescription,
  extensible,
}) => {
  return {
    type: "composite",
    prototypeIdentifier,
    valueOfIdentifier,
    propertiesDescription,
    symbolsDescription,
    extensible,
  }
}

const createForbiddenFunctionErrorMessage = ({ path }) => {
  if (path.length === 0) return `function are not allowed.`

  return `function are not allowed.
function found at: ${path.join(",")}`
}

const createUnexpectedValueOfReturnValueErrorMessage = () =>
  `valueOf() must return a primitive of the object itself.`

const createUnexpectedSymbolErrorMessage = ({
  symbol,
}) => `symbol must be global, like Symbol.iterator, or created using Symbol.for().
symbol: ${symbol.toString()}`

const createUnexpectedPrototypeErrorMessage = () =>
  `prototype must be global, like Object.prototype, or somewhere in the value.`
