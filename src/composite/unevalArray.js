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
    const valueSource = unevalPrimitive(value[i], nestedOptions)
    if (compact) {
      if (i === 0) {
        valuesSource += valueSource
      } else {
        valuesSource += `, ${valueSource}`
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

  const { arrayConstructor } = options
  if (arrayConstructor) {
    arraySource = `Array(${arraySource})`
  } else {
    arraySource = `[${arraySource}]`
  }

  return unevalConstructor(arraySource, options)
}