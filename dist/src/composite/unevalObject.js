"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.unevalObject = void 0;

var _util = require("../util.js");

var _index = require("../primitive/index.js");

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const unevalObject = (value, options = {}) => {
  const {
    seen = []
  } = options;

  if (seen.indexOf(value) > -1) {
    return "Symbol.for('circular')";
  }

  seen.push(value);
  let propertiesSource = "";
  const propertyNames = Object.getOwnPropertyNames(value);
  let i = 0;
  const j = propertyNames.length;
  const {
    depth = 0
  } = options;
  const {
    compact
  } = options;

  const nestedOptions = _objectSpread({}, options, {
    depth: depth + 1,
    seen
  });

  while (i < j) {
    const propertyName = propertyNames[i];
    const propertyNameAsNumber = parseInt(propertyName, 10);
    const propertyNameSource = (0, _index.unevalPrimitive)(Number.isInteger(propertyNameAsNumber) ? propertyNameAsNumber : propertyName, nestedOptions);
    const propertyValueSource = (0, _index.unevalPrimitive)(value[propertyName], nestedOptions);

    if (compact) {
      if (i === 0) {
        propertiesSource += `${propertyNameSource}: ${propertyValueSource}`;
      } else {
        propertiesSource += `, ${propertyNameSource}: ${propertyValueSource}`;
      }
    } else if (i === 0) {
      propertiesSource += `${propertyNameSource}: ${propertyValueSource}`;
    } else {
      propertiesSource += `,${(0, _util.preNewLineAndIndentation)(`${propertyNameSource}: ${propertyValueSource}`, options)}`;
    }

    i++;
  }

  let objectSource;

  if (propertiesSource.length) {
    if (compact) {
      objectSource = `${propertiesSource}`;
    } else {
      objectSource = `${(0, _util.wrapNewLineAndIndentation)(propertiesSource, options)}`;
    }
  } else {
    objectSource = "";
  }

  const {
    objectConstructor
  } = options;

  if (objectConstructor) {
    objectSource = `Object({${objectSource}})`;
  } else {
    objectSource = `{${objectSource}}`;
  }

  return (0, _util.unevalConstructor)(objectSource, options);
};

exports.unevalObject = unevalObject;
//# sourceMappingURL=./unevalObject.js.map