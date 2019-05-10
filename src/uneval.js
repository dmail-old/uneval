/* eslint-disable import/max-dependencies */
import { valueToType } from "./valueToType.js"
import { primitiveMap } from "./primitive/index.js"
import { compositeMap } from "./composite/index.js"
import { unevalConstructor } from "./unevalConstructor.js"
import { unevalObject } from "./composite/unevalObject.js"

export const uneval = (
  value,
  {
    parenthesis = false,
    singleQuote = false,
    useNew = false,
    objectConstructor = false,
    compact = false,
    showFunctionBody = false,
    indentUsingTab = false,
    indentSize = 2,
    accurateErrorProperties = false,
  } = {},
) => {
  const scopedUneval = (scopedValue, scopedOptions) => {
    const { primitiveType, compositeType } = valueToType(scopedValue)
    const options = {
      ...scopedOptions,
      nestedUneval: (nestedValue, nestedOptions = {}) => {
        return scopedUneval(nestedValue, {
          ...scopedOptions,
          depth: scopedOptions.depth + 1,
          ...nestedOptions,
        })
      },
    }
    if (primitiveType) return primitiveMap[primitiveType](scopedValue, options)
    if (compositeType in compositeMap) return compositeMap[compositeType](scopedValue, options)

    return unevalConstructor(`${compositeType}(${unevalObject(scopedValue, options)})`, {
      ...options,
      parenthesis: false,
    })
  }

  return scopedUneval(value, {
    parenthesis,
    singleQuote,
    useNew,
    objectConstructor,
    compact,
    showFunctionBody,
    indentUsingTab,
    indentSize,
    accurateErrorProperties,
    depth: 0,
  })
}
