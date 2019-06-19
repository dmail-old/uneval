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

    if (typeof Promise === "function" && value instanceof Promise)
      throw new Error(createPromiseAreNotSupportedMessage({ path }))
    if (typeof WeakSet === "function" && value instanceof WeakSet)
      throw new Error(createWeakSetAreNotSupportedMessage({ path }))
    if (typeof WeakMap === "function" && value instanceof WeakMap)
      throw new Error(createWeakMapAreNotSupportedMessage({ path }))
    if (typeof value === "function" && !functionAllowed)
      throw new Error(createForbiddenFunctionMessage({ path }))

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
        const descriptorValue = propertyDescriptor[descriptorName]

        if (descriptorName === "set" && descriptorValue && !functionAllowed)
          throw new Error(createForbiddenPropertySetterMessage({ path, propertyName }))
        if (descriptorName === "get" && descriptorValue && !functionAllowed)
          throw new Error(createForbiddenPropertyGetterMessage({ path, propertyName }))

        const descriptorNameIdentifier = valueToIdentifier(descriptorName, [
          ...path,
          `["${propertyName}"]`,
          `[[propertyDescriptor:${descriptorName}]]`,
        ])
        const descriptorValueIdentifier = valueToIdentifier(descriptorValue, [
          ...path,
          `["${propertyName}"]`,
          `[[propertyDescriptor:${descriptorName}]]`,
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
          `[${symbol.toString()}]`,
          `[[propertyDescriptor:${descriptorName}]]`,
        ])
        const descriptorValueIdentifier = valueToIdentifier(propertyDescriptor[descriptorName], [
          ...path,
          `[${symbol.toString()}]`,
          `[[propertyDescriptor:${descriptorName}]]`,
        ])
        propertyDescription[descriptorNameIdentifier] = descriptorValueIdentifier
      })
      const symbolIdentifier = valueToIdentifier(symbol, [...path, symbol])
      symbolsDescription[symbolIdentifier] = propertyDescription
    })

    const methodsDescription = computeMethodsDescription(value, path)

    const extensible = Object.isExtensible(value)

    recipeArray[identifier] = createCompositeRecipe({
      propertiesDescription,
      symbolsDescription,
      methodsDescription,
      extensible,
    })
    return identifier
  }

  const computeMethodsDescription = (value, path) => {
    const methodsDescription = {}

    if (typeof Set === "function" && value instanceof Set) {
      const addCallArray = []
      value.forEach((entryValue, index) => {
        const entryValueIdentifier = valueToIdentifier(entryValue, [
          ...path,
          `[[SetEntryValue]]`,
          index,
        ])
        addCallArray.push([entryValueIdentifier])
      })
      methodsDescription[valueToIdentifier("add")] = addCallArray
    }

    if (typeof Map === "function" && value instanceof Map) {
      const setCallArray = []
      value.forEach((entryValue, entryKey) => {
        const entryKeyIdentifier = valueToIdentifier(entryKey, [
          ...path,
          "[[MapEntryKey]]",
          entryKey,
        ])
        const entryValueIdentifier = valueToIdentifier(entryValue, [
          ...path,
          "[[MapEntryValue]]",
          entryValue,
        ])
        setCallArray.push([entryKeyIdentifier, entryValueIdentifier])
      })
      methodsDescription[valueToIdentifier("set")] = setCallArray
    }

    return methodsDescription
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

    // otherwise prototype is unknown
    throw new Error(createUnknownPrototypeMessage({ prototypeValue }))
  }
  const identifierForValueOf = (value, path) => {
    if (value instanceof Array) return valueToIdentifier(value.length, [...path, "length"])

    if ("valueOf" in value === false) return undefined

    if (typeof value.valueOf !== "function") return undefined

    const valueOfReturnValue = value.valueOf()
    if (!isComposite(valueOfReturnValue))
      return valueToIdentifier(valueOfReturnValue, [...path, "valueOf()"])

    if (valueOfReturnValue === value) return undefined

    throw new Error(createUnexpectedValueOfReturnValueMessage())
  }

  recipeArray.slice().forEach((recipe, index) => {
    if (recipe.type === "composite") {
      const value = valueMap[index]

      if (typeof value === "function") {
        const valueOfIdentifier = nextIdentifier()
        recipeArray[valueOfIdentifier] = {
          type: "primitive",
          value,
        }
        recipe.valueOfIdentifier = valueOfIdentifier
        return
      }

      if (value instanceof RegExp) {
        const valueOfIdentifier = nextIdentifier()
        recipeArray[valueOfIdentifier] = {
          type: "primitive",
          value,
        }
        recipe.valueOfIdentifier = valueOfIdentifier
        return
      }

      // valueOf, mandatory to uneval new Date(10) for instance.
      recipe.valueOfIdentifier = identifierForValueOf(value)
      const prototypeValue = Object.getPrototypeOf(value)
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
  if (!symbolGlobalPath) throw new Error(createUnknownSymbolMessage({ symbol }))

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
  methodsDescription,
  extensible,
}) => {
  return {
    type: "composite",
    prototypeIdentifier,
    valueOfIdentifier,
    propertiesDescription,
    symbolsDescription,
    methodsDescription,
    extensible,
  }
}

const createPromiseAreNotSupportedMessage = ({ path }) => {
  if (path.length === 0) return `promise are not supported.`

  return `promise are not supported.
promise found at: ${path.join("")}`
}

const createWeakSetAreNotSupportedMessage = ({ path }) => {
  if (path.length === 0) return `weakSet are not supported.`

  return `weakSet are not supported.
weakSet found at: ${path.join("")}`
}

const createWeakMapAreNotSupportedMessage = ({ path }) => {
  if (path.length === 0) return `weakMap are not supported.`

  return `weakMap are not supported.
weakMap found at: ${path.join("")}`
}

const createForbiddenFunctionMessage = ({ path }) => {
  if (path.length === 0) return `function are not allowed.`

  return `function are not allowed.
function found at: ${path.join("")}`
}

const createForbiddenPropertyGetterMessage = ({
  path,
  propertyName,
}) => `property getter are not allowed.
getter found on property: ${propertyName}
at: ${path.join("")}`

const createForbiddenPropertySetterMessage = ({
  path,
  propertyName,
}) => `property setter are not allowed.
setter found on property: ${propertyName}
at: ${path.join("")}`

const createUnexpectedValueOfReturnValueMessage = () =>
  `valueOf() must return a primitive of the object itself.`

const createUnknownSymbolMessage = ({
  symbol,
}) => `symbol must be global, like Symbol.iterator, or created using Symbol.for().
symbol: ${symbol.toString()}`

const createUnknownPrototypeMessage = () =>
  `prototype must be global, like Object.prototype, or somewhere in the value.`
