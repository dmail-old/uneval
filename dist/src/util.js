"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.wrapNewLineAndIndentation = exports.preNewLineAndIndentation = exports.unevalConstructor = exports.quote = void 0;

// https://github.com/joliss/js-string-escape/blob/master/index.js
// http://javascript.crockford.com/remedial.html
const quote = value => {
  const string = String(value);
  let i = 0;
  const j = string.length;
  var escapedString = "";

  while (i < j) {
    const char = string[i];
    let escapedChar;

    if (char === '"' || char === "'" || char === "\\") {
      escapedChar = `\\${char}`;
    } else if (char === "\n") {
      escapedChar = "\\n";
    } else if (char === "\r") {
      escapedChar = "\\r";
    } else if (char === "\u2028") {
      escapedChar = "\\u2028";
    } else if (char === "\u2029") {
      escapedChar = "\\u2029";
    } else {
      escapedChar = char;
    }

    escapedString += escapedChar;
    i++;
  }

  return escapedString;
};

exports.quote = quote;

const unevalConstructor = (value, {
  parenthesis,
  useNew
}) => {
  let formattedString = value;

  if (parenthesis) {
    formattedString = `(${value})`;
  }

  if (useNew) {
    formattedString = `new ${formattedString}`;
  }

  return formattedString;
};

exports.unevalConstructor = unevalConstructor;

const newLineAndIndent = ({
  count,
  useTabs,
  size
}) => {
  if (useTabs) {
    // eslint-disable-next-line prefer-template
    return "\n" + "\t".repeat(count);
  } // eslint-disable-next-line prefer-template


  return "\n" + " ".repeat(count * size);
};

const preNewLineAndIndentation = (value, {
  depth = 0,
  indentUsingTab,
  indentSize
}) => {
  return `${newLineAndIndent({
    count: depth + 1,
    useTabs: indentUsingTab,
    size: indentSize
  })}${value}`;
};

exports.preNewLineAndIndentation = preNewLineAndIndentation;

const postNewLineAndIndentation = ({
  depth = 0,
  indentUsingTab,
  indentSize
}) => {
  return newLineAndIndent({
    count: depth,
    useTabs: indentUsingTab,
    size: indentSize
  });
};

const wrapNewLineAndIndentation = (value, options) => {
  return `${preNewLineAndIndentation(value, options)}${postNewLineAndIndentation(options)}`;
};

exports.wrapNewLineAndIndentation = wrapNewLineAndIndentation;
//# sourceMappingURL=./util.js.map