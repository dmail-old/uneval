import { preNewLineAndIndentation, wrapNewLineAndIndentation } from "../util.js"
import { unevalConstructor } from "../unevalConstructor.js"

export const unevalObject = (
  value,
  {
    nestedUneval,
    seen = [],
    compact,
    depth,
    indentUsingTab,
    indentSize,
    objectConstructor,
    parenthesis,
    useNew,
  },
) => {
  if (seen.indexOf(value) > -1) {
    return "Symbol.for('circular')"
  }
  seen.push(value)

  let propertiesSource = ""
  const propertyNames = Object.getOwnPropertyNames(value)
  let i = 0
  const j = propertyNames.length

  while (i < j) {
    const propertyName = propertyNames[i]
    const propertyNameAsNumber = parseInt(propertyName, 10)
    const propertyNameSource = nestedUneval(
      Number.isInteger(propertyNameAsNumber) ? propertyNameAsNumber : propertyName,
    )
    const propertyValueSource = nestedUneval(value[propertyName], { seen })

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
        { depth, indentUsingTab, indentSize },
      )}`
    }

    i++
  }

  let objectSource
  if (propertiesSource.length) {
    if (compact) {
      objectSource = `${propertiesSource}`
    } else {
      objectSource = `${wrapNewLineAndIndentation(propertiesSource, {
        depth,
        indentUsingTab,
        indentSize,
      })}`
    }
  } else {
    objectSource = ""
  }

  if (objectConstructor) {
    objectSource = `Object({${objectSource}})`
  } else {
    objectSource = `{${objectSource}}`
  }

  return unevalConstructor(objectSource, { parenthesis, useNew })
}
