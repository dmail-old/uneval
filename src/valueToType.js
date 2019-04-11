export const valueToType = (value) => {
  const primitiveType = valueToPrimitiveType(value)
  if (primitiveType === "function") {
    return { compositeType: "Function" }
  }
  if (primitiveType === "object") {
    const compositeType = valueToCompositeType(value)
    return { compositeType }
  }
  return { primitiveType }
}

const { toString } = Object.prototype

const valueToCompositeType = (object) => {
  if (typeof object === "object" && Object.getPrototypeOf(object) === null) return "Object"

  const toStringResult = toString.call(object)
  // returns format is '[object ${tagName}]';
  // and we want ${tagName}
  const tagName = toStringResult.slice("[object ".length, -1)
  if (tagName === "Object") {
    const objectConstructorName = object.constructor.name
    if (objectConstructorName !== "Object") {
      return objectConstructorName
    }
  }
  return tagName
}

const valueToPrimitiveType = (value) => {
  if (value === null) {
    return "null"
  }

  if (value === undefined) {
    return "undefined"
  }

  return typeof value
}

// const type = getCompositeType(value)

// if (type in mapping) {
//   return mapping[type](value, options)
// }

// return unevalConstructor(`${type}(${unevalObject(value, options)})`, {
//   ...options,
//   parenthesis: false,
// })
