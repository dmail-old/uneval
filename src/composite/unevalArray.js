import { unevalConstructor, preNewLineAndIndentation, wrapNewLineAndIndentation } from "../util.js"
import { unevalPrimitive } from "../primitive/index.js"

export const unevalArray = (value, options = {}) => {
  const { seen = [] } = options
  if (seen.indexOf(value) > -1) {
    return "Symbol.for('circular')"
  }
  seen.push(value)

  let valuesSource = ""
  let i = 0
  const j = value.length
  const { compact } = options
  const { depth = 0 } = options

  const nestedOptions = {
    ...options,
    depth: depth + 1,
    seen,
  }

  while (i < j) {
    const valueSource = value.hasOwnProperty(i) ? unevalPrimitive(value[i], nestedOptions) : ""
    if (compact) {
      if (i === 0) {
        valuesSource += valueSource
      } else if (valueSource) {
        valuesSource += `, ${valueSource}`
      } else {
        valuesSource += `,`
      }
    } else if (i === 0) {
      valuesSource += valueSource
    } else {
      valuesSource += `,${preNewLineAndIndentation(valueSource, options)}`
    }
    i++
  }

  let arraySource
  if (valuesSource.length) {
    if (compact) {
      arraySource = `${valuesSource}`
    } else {
      arraySource = wrapNewLineAndIndentation(valuesSource, options)
    }
  } else {
    arraySource = ""
  }

  arraySource = `[${arraySource}]`

  return unevalConstructor(arraySource, options)
}
