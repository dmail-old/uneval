import { unevalArray } from "./unevalArray.js"
import { unevalObject } from "./unevalObject.js"
import { unevalConstructor } from "../util.js"
import { unevalPrimitive } from "../primitive/index.js"
import { unevalDate } from "./unevalDate.js"

const unevalBoolean = (value, options = {}) => {
  const { depth = 0 } = options
  const booleanSource = unevalPrimitive(value.valueOf(), { ...options, depth: depth + 1 })

  return unevalConstructor(`Boolean(${booleanSource})`, options)
}

const unevalError = (value, options = {}) => {
  const { depth = 0 } = options
  const messageSource = unevalPrimitive(value.message, { ...options, depth: depth + 1 })

  return unevalConstructor(`${value.name}(${messageSource})`, options)
}

const unevalRegExp = (value) => {
  return value.toString()
}

const unevalNumber = (value, options = {}) => {
  const { depth = 0 } = options
  const numberSource = unevalPrimitive(value.valueOf(), { ...options, depth: depth + 1 })

  return unevalConstructor(`Number(${numberSource})`, options)
}

const unevalString = (value, options) => {
  const { depth = 0 } = options
  const stringSource = unevalPrimitive(value.valueOf(), { ...options, depth: depth + 1 })

  return unevalConstructor(`String(${stringSource})`, options)
}

const { toString } = Object.prototype

const getCompositeType = (object) => {
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

const mapping = {
  Array: unevalArray,
  Boolean: unevalBoolean,
  Date: unevalDate,
  Error: unevalError,
  Number: unevalNumber,
  Object: unevalObject,
  RegExp: unevalRegExp,
  String: unevalString,
}

export const unevalComposite = (value, options) => {
  const type = getCompositeType(value)

  if (type in mapping) {
    return mapping[type](value, options)
  }

  return unevalConstructor(`${type}(${unevalObject(value, options)})`, {
    ...options,
    parenthesis: false,
  })
}
