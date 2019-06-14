/**
 * transforms a javascript value into an object describing it.
 *
 */

import { isComposite } from "./is-composite.js"
import { getCompositeGlobalPath, getPrimitiveGlobalPath } from "./global-value-path.js"

export const decompose = (mainValue) => {
  const values = []
  const recipes = []

  const valueToRecipeIdentifier = (value) => {
    if (!isComposite(value)) {
      const existingPrimitiveIndex = values.findIndex((existingValue) => {
        if (Object.is(value, existingValue)) return true
        return value === existingValue
      })
      if (existingPrimitiveIndex > -1) return existingPrimitiveIndex
      const recipeIdentifier = values.length
      values.push(value)

      if (typeof value === "symbol") {
        const symbolGlobalPath = getPrimitiveGlobalPath(value)
        if (!symbolGlobalPath)
          throw new Error(createUnexpectedSymbolErrorMessage({ symbol: value }))

        recipes[recipeIdentifier] = {
          type: "global-reference",
          globalPath: symbolGlobalPath,
        }
        return recipeIdentifier
      }
      recipes[recipeIdentifier] = {
        type: "primitive",
        value,
      }
      return recipeIdentifier
    }

    const existingCompositeIndex = values.indexOf(value)
    if (existingCompositeIndex > -1) return existingCompositeIndex
    const recipeIdentifier = values.length
    values.push(value)

    const compositeGlobalPath = getCompositeGlobalPath(value)
    if (compositeGlobalPath) {
      recipes[recipeIdentifier] = {
        type: "global-reference",
        globalPath: compositeGlobalPath,
      }
      return recipeIdentifier
    }

    const recipeParts = {}

    if ("valueOf" in value && typeof value.valueOf === "function") {
      // usefull because new Date(10).valueOf() === 10
      // or new Boolean(true).valueOf() === true
      const valueOfReturnValue = value.valueOf()
      if (isComposite(valueOfReturnValue)) {
        if (valueOfReturnValue !== value) {
          throw new Error(
            `cannot decompose an object having a valueOf method returning a different composite`,
          )
        }
      } else {
        const valueOfRecipeIdentifier = valueToRecipeIdentifier(valueOfReturnValue)
        recipeParts.valueOfRecipeIdentifier = valueOfRecipeIdentifier
      }
    }

    const propertyRecipeArray = []
    Object.getOwnPropertyNames(value).forEach((propertyName) => {
      const propertyNameRecipeIdentifier = valueToRecipeIdentifier(propertyName)
      const propertyDescriptor = Object.getOwnPropertyDescriptor(value, propertyName)
      Object.keys(propertyDescriptor).forEach((descriptorName) => {
        const descriptorNameRecipeIdentifier = valueToRecipeIdentifier(descriptorName)
        const descriptorValueRecipeIdentifier = valueToRecipeIdentifier(
          propertyDescriptor[descriptorName],
        )
        propertyRecipeArray.push({
          propertyNameRecipeIdentifier,
          descriptorNameRecipeIdentifier,
          descriptorValueRecipeIdentifier,
        })
      })
    })
    recipeParts.propertyRecipeArray = propertyRecipeArray

    const symbolRecipeArray = []
    Object.getOwnPropertySymbols(value).forEach((symbol) => {
      const symbolRecipeIdentifier = valueToRecipeIdentifier(symbol)
      const propertyDescriptor = Object.getOwnPropertyDescriptor(value, symbol)
      Object.keys(propertyDescriptor).forEach((descriptorName) => {
        const descriptorNameRecipeIdentifier = valueToRecipeIdentifier(descriptorName)
        const descriptorValueRecipeIdentifier = valueToRecipeIdentifier(
          propertyDescriptor[descriptorName],
        )
        symbolRecipeArray.push({
          symbolRecipeIdentifier,
          descriptorNameRecipeIdentifier,
          descriptorValueRecipeIdentifier,
        })
      })
    })
    recipeParts.symbolRecipeArray = symbolRecipeArray

    const prototypeValue = Object.getPrototypeOf(value)
    if (prototypeValue === null) {
      recipeParts.prototypeRecipeIdentifier = valueToRecipeIdentifier(prototypeValue)
    } else {
      const prototypeIndex = values.indexOf(prototypeValue)
      if (prototypeIndex > -1) {
        recipeParts.prototypeRecipeIdentifier = prototypeIndex
      } else {
        const prototypeRecipeIdentifier = values.length
        values.push(prototypeValue)
        const prototypeGlobalPath = getCompositeGlobalPath(prototypeValue)
        if (prototypeGlobalPath) {
          recipes[prototypeRecipeIdentifier] = {
            type: "global-reference",
            globalPath: prototypeGlobalPath,
          }
          recipeParts.prototypeRecipeIdentifier = prototypeRecipeIdentifier
        } else {
          throw new Error(createUnexpectedPrototypeErrorMessage({ prototypeValue }))
        }
      }
    }

    recipes[recipeIdentifier] = {
      type: "composite",
      ...recipeParts,
    }
    return recipeIdentifier
  }
  const mainRecipeIdentifier = valueToRecipeIdentifier(mainValue)

  return { recipes, mainRecipeIdentifier }
}

const createUnexpectedSymbolErrorMessage = ({ symbol }) => `symbol must be a well known symbol.
symbol: ${symbol}`

const createUnexpectedPrototypeErrorMessage = ({ prototypeValue }) =>
  `prototype must be a well known prototype or somewhere in the value.
prototypeValue: ${prototypeValue}`
