export const unevalConstructor = (value, { parenthesis, useNew }) => {
  let formattedString = value

  if (parenthesis) {
    formattedString = `(${value})`
  }

  if (useNew) {
    formattedString = `new ${formattedString}`
  }

  return formattedString
}
