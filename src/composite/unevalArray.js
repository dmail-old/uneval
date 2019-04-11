import { preNewLineAndIndentation, wrapNewLineAndIndentation } from "../util.js"
import { unevalConstructor } from "../unevalConstructor.js"

export const unevalArray = (
  value,
  { seen = [], nestedUneval, compact, depth, indentUsingTab, indentSize, parenthesis, useNew },
) => {
  if (seen.indexOf(value) > -1) {
    return "Symbol.for('circular')"
  }
  seen.push(value)

  let valuesSource = ""
  let i = 0
  const j = value.length

  while (i < j) {
    const valueSource = value.hasOwnProperty(i) ? nestedUneval(value[i], { seen }) : ""
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
      valuesSource += `,${preNewLineAndIndentation(valueSource, {
        depth,
        indentUsingTab,
        indentSize,
      })}`
    }
    i++
  }

  let arraySource
  if (valuesSource.length) {
    if (compact) {
      arraySource = `${valuesSource}`
    } else {
      arraySource = wrapNewLineAndIndentation(valuesSource, { depth, indentUsingTab, indentSize })
    }
  } else {
    arraySource = ""
  }

  arraySource = `[${arraySource}]`

  return unevalConstructor(arraySource, { parenthesis, useNew })
}
