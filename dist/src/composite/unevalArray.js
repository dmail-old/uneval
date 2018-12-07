"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.unevalArray = void 0;

var _util = require("../util.js");

var _index = require("../primitive/index.js");

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const unevalArray = (value, options = {}) => {
  const {
    seen = []
  } = options;

  if (seen.indexOf(value) > -1) {
    return "Symbol.for('circular')";
  }

  seen.push(value);
  let valuesSource = "";
  let i = 0;
  const j = value.length;
  const {
    compact
  } = options;
  const {
    depth = 0
  } = options;

  const nestedOptions = _objectSpread({}, options, {
    depth: depth + 1,
    seen
  });

  while (i < j) {
    const valueSource = value.hasOwnProperty(i) ? (0, _index.unevalPrimitive)(value[i], nestedOptions) : "";

    if (compact) {
      if (i === 0) {
        valuesSource += valueSource;
      } else if (valueSource) {
        valuesSource += `, ${valueSource}`;
      } else {
        valuesSource += `,`;
      }
    } else if (i === 0) {
      valuesSource += valueSource;
    } else {
      valuesSource += `,${(0, _util.preNewLineAndIndentation)(valueSource, options)}`;
    }

    i++;
  }

  let arraySource;

  if (valuesSource.length) {
    if (compact) {
      arraySource = `${valuesSource}`;
    } else {
      arraySource = (0, _util.wrapNewLineAndIndentation)(valuesSource, options);
    }
  } else {
    arraySource = "";
  }

  arraySource = `[${arraySource}]`;
  return (0, _util.unevalConstructor)(arraySource, options);
};

exports.unevalArray = unevalArray;
//# sourceMappingURL=./unevalArray.js.map