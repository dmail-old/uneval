import { unevalConstructor, preNewLineAndIndentation, wrapNewLineAndIndentation } from "../util.js"
import { unevalPrimitive } from "../primitive/index.js"

export const unevalObject = (value, options = {}) => {
  const { seen = [] } = options
  if (seen.indexOf(value) > -1) {
    return "Symbol.for('circular')"
  }
  seen.push(value)

  let propertiesSource = ""
  const propertyNames = Object.getOwnPropertyNames(value)
  let i = 0
  const j = propertyNames.length
  const { depth = 0 } = options
  const { compact } = options

  const nestedOptions = {
    ...options,
    depth: depth + 1,
    seen,
  }

  while (i < j) {
    const propertyName = propertyNames[i]
    const propertyNameSource = unevalPrimitive(propertyName, nestedOptions)
    const propertyValueSource = unevalPrimitive(value[propertyName], nestedOptions)

    if (compact) {
      if (i === 0) {
        propertiesSource += `${propertyNameSource}: ${propertyValueSource}`
      } else {
        propertiesSource += `, ${propertyNameSource}: ${propertyValueSource}`
      }
    } else if (i === 0) {
      propertiesSource += `${propertyNameSource}: ${propertyValueSource}`
    } else {
      propertiesSource += `,${preNewLineAndIndentation(
        `${propertyNameSource}: ${propertyValueSource}`,
        options,
      )}`
    }

    i++
  }

  let objectSource
  if (propertiesSource.length) {
    if (compact) {
      objectSource = `${propertiesSource}`
    } else {
      objectSource = `${wrapNewLineAndIndentation(propertiesSource, options)}`
    }
  } else {
    objectSource = ""
  }

  const { objectConstructor } = options
  if (objectConstructor) {
    objectSource = `Object(${objectSource})`
  } else {
    objectSource = `{${objectSource}}`
  }

  return unevalConstructor(objectSource, options)
}
