// https://github.com/joliss/js-string-escape/blob/master/index.js
// http://javascript.crockford.com/remedial.html
export const quote = (value) => {
  const string = String(value)
  let i = 0
  const j = string.length
  var escapedString = ""
  while (i < j) {
    const char = string[i]
    let escapedChar
    if (char === '"' || char === "'" || char === "\\") {
      escapedChar = `\\${char}`
    } else if (char === "\n") {
      escapedChar = "\\n"
    } else if (char === "\r") {
      escapedChar = "\\r"
    } else if (char === "\u2028") {
      escapedChar = "\\u2028"
    } else if (char === "\u2029") {
      escapedChar = "\\u2029"
    } else {
      escapedChar = char
    }
    escapedString += escapedChar
    i++
  }
  return escapedString
}

export const preNewLineAndIndentation = (value, { depth, indentUsingTab, indentSize }) => {
  return `${newLineAndIndent({
    count: depth + 1,
    useTabs: indentUsingTab,
    size: indentSize,
  })}${value}`
}

const postNewLineAndIndentation = ({ depth, indentUsingTab, indentSize }) => {
  return newLineAndIndent({ count: depth, useTabs: indentUsingTab, size: indentSize })
}

const newLineAndIndent = ({ count, useTabs, size }) => {
  if (useTabs) {
    // eslint-disable-next-line prefer-template
    return "\n" + "\t".repeat(count)
  }
  // eslint-disable-next-line prefer-template
  return "\n" + " ".repeat(count * size)
}

export const wrapNewLineAndIndentation = (value, { depth, indentUsingTab, indentSize }) => {
  return `${preNewLineAndIndentation(value, {
    depth,
    indentUsingTab,
    indentSize,
  })}${postNewLineAndIndentation({ depth, indentUsingTab, indentSize })}`
}
