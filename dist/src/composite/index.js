"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.unevalComposite = void 0;

var _unevalArray = require("./unevalArray.js");

var _unevalObject = require("./unevalObject.js");

var _util = require("../util.js");

var _index = require("../primitive/index.js");

var _unevalDate = require("./unevalDate.js");

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const unevalBoolean = (value, options = {}) => {
  const {
    depth = 0
  } = options;
  const booleanSource = (0, _index.unevalPrimitive)(value.valueOf(), _objectSpread({}, options, {
    depth: depth + 1
  }));
  return (0, _util.unevalConstructor)(`Boolean(${booleanSource})`, options);
};

const unevalError = (value, options = {}) => {
  const {
    depth = 0
  } = options;
  const messageSource = (0, _index.unevalPrimitive)(value.message, _objectSpread({}, options, {
    depth: depth + 1
  }));
  return (0, _util.unevalConstructor)(`${value.name}(${messageSource})`, options);
};

const unevalRegExp = value => {
  return value.toString();
};

const unevalNumber = (value, options = {}) => {
  const {
    depth = 0
  } = options;
  const numberSource = (0, _index.unevalPrimitive)(value.valueOf(), _objectSpread({}, options, {
    depth: depth + 1
  }));
  return (0, _util.unevalConstructor)(`Number(${numberSource})`, options);
};

const unevalString = (value, options) => {
  const {
    depth = 0
  } = options;
  const stringSource = (0, _index.unevalPrimitive)(value.valueOf(), _objectSpread({}, options, {
    depth: depth + 1
  }));
  return (0, _util.unevalConstructor)(`String(${stringSource})`, options);
};

const {
  toString
} = Object.prototype;

const getCompositeType = object => {
  if (typeof object === "object" && Object.getPrototypeOf(object) === null) return "Object";
  const toStringResult = toString.call(object); // returns format is '[object ${tagName}]';
  // and we want ${tagName}

  const tagName = toStringResult.slice("[object ".length, -1);

  if (tagName === "Object") {
    const objectConstructorName = object.constructor.name;

    if (objectConstructorName !== "Object") {
      return objectConstructorName;
    }
  }

  return tagName;
};

const mapping = {
  Array: _unevalArray.unevalArray,
  Boolean: unevalBoolean,
  Date: _unevalDate.unevalDate,
  Error: unevalError,
  Number: unevalNumber,
  Object: _unevalObject.unevalObject,
  RegExp: unevalRegExp,
  String: unevalString
};

const unevalComposite = (value, options) => {
  const type = getCompositeType(value);

  if (type in mapping) {
    return mapping[type](value, options);
  }

  return (0, _util.unevalConstructor)(`${type}(${(0, _unevalObject.unevalObject)(value, options)})`, _objectSpread({}, options, {
    parenthesis: false
  }));
};

exports.unevalComposite = unevalComposite;
//# sourceMappingURL=./index.js.map