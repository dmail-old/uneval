/**
 * transforms a javascript value into an object describing it.
 *
 */

import { isComposite } from "./is-composite.js"

export const decompose = (rootValue) => {
  const composites = []
  const primitives = []
  const links = []

  const visit = (value) => {
    if (isComposite(value)) {
      const existingCompositeIndex = composites.indexOf(value)

      if (existingCompositeIndex === -1) {
        const identifier = composites.length
        composites.push(value)

        // for date and regexp we need valueOf
        // by default we'll consider if valueOf returns a primitive
        // it must be passed to the constructor
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
            const valueOfReturnValueVisitResult = visit(valueOfReturnValue)
            const valueOfLink = {
              fromCompositeIdentifier: identifier,
              toDescription: valueOfReturnValueVisitResult,
              data: {
                type: "valueOf",
              },
            }
            links.push(valueOfLink)
          }
        }

        const prototype = Object.getPrototypeOf(value)
        if (prototype) {
          const prototypeVisitResult = visit(prototype)
          const prototypeLink = {
            fromCompositeIdentifier: identifier,
            toDescription: prototypeVisitResult,
            data: {
              type: "prototype",
            },
          }
          links.push(prototypeLink)
        }

        const propertyNamesLinks = []
        Object.getOwnPropertyNames(value).forEach((propertyName) => {
          const propertyDescriptor = Object.getOwnPropertyDescriptor(value, propertyName)
          Object.keys(propertyDescriptor).forEach((descriptorName) => {
            const descriptorValue = propertyDescriptor[descriptorName]
            const descriptorValueVisitResult = visit(descriptorValue)
            propertyNamesLinks.push({
              fromCompositeIdentifier: identifier,
              toDescription: descriptorValueVisitResult,
              data: {
                type: "property",
                propertyName,
                descriptorName,
              },
            })
          })
        })
        links.push(...propertyNamesLinks)

        const symbolsLinks = []
        Object.getOwnPropertySymbols(value).forEach((symbol) => {
          const propertyDescriptor = Object.getOwnPropertyDescriptor(value, symbol)
          Object.keys(propertyDescriptor).forEach((descriptorName) => {
            const descriptorValue = propertyDescriptor[descriptorName]
            const descriptorValueVisitResult = visit(descriptorValue)
            symbolsLinks.push({
              fromCompositeIdentifier: identifier,
              toDescription: descriptorValueVisitResult,
              data: {
                type: "symbol",
                symbol,
                descriptorName,
              },
            })
          })
        })
        links.push(...symbolsLinks)

        return { type: "composite", identifier }
      }

      return { type: "composite", identifier: existingCompositeIndex }
    }

    const existingPrimitiveIndex = primitives.findIndex((existingValue) => {
      if (Object.is(value, existingValue)) return true
      return value === existingValue
    })
    if (existingPrimitiveIndex === -1) {
      const identifier = primitives.length
      primitives.push(value)
      return { type: "primitive", identifier }
    }

    return { type: "primitive", identifier: existingPrimitiveIndex }
  }
  visit(rootValue)

  return { primitives, composites, links }
}
