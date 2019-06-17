export const recompose = ({ recipes, mainIdentifier }) => {
  const values = {}
  const globalObject = typeof window === "object" ? window : global

  const followRecipe = (recipe) => {
    if (recipe.type === "primitive") return followPrimitiveRecipe(recipe)
    if (recipe.type === "global-symbol") return followGlobalSymbolRecipe(recipe)
    if (recipe.type === "global-reference") return followGlobalReferenceRecipe(recipe)
    return followCompositeRecipe(recipe, recipes)
  }

  const followPrimitiveRecipe = ({ value }) => value

  const followGlobalSymbolRecipe = ({ key }) => Symbol.for(key)

  const followGlobalReferenceRecipe = ({ globalPath }) => {
    let currentValue = globalObject
    let i = 0
    while (i < globalPath.length) {
      const part = globalPath[i]
      i++
      if (part in currentValue === false) return undefined
      currentValue = currentValue[part]
    }
    return currentValue
  }

  const followCompositeRecipe = ({
    prototypeIdentifier,
    propertiesMap,
    symbolsMap,
    extensible,
  }) => {
    const prototypeValue = values[prototypeIdentifier]
    const composite = Object.create(prototypeValue)

    Object.keys(propertiesMap).forEach((propertyNameIdentifier) => {
      const propertyName = values[propertyNameIdentifier]
      const description = propertiesMap[propertyNameIdentifier]
      Object.defineProperty(composite, propertyName, producePropertyDescriptor(description))
    })

    Object.keys(symbolsMap).forEach((symbolIdentifier) => {
      const symbol = values[symbolIdentifier]
      const description = propertiesMap[symbolIdentifier]
      Object.defineProperty(composite, symbol, producePropertyDescriptor(description))
    })

    if (!extensible) Object.preventExtensions(composite)

    return composite
  }

  const producePropertyDescriptor = (description) => {
    const descriptor = {}
    Object.keys(description).forEach((descriptorNameIdentifier) => {
      const descriptorName = values[descriptorNameIdentifier]
      const descriptorValueIdentifier = description[descriptorNameIdentifier]
      descriptor[descriptorName] = descriptorValueIdentifier
    })
    return descriptor
  }

  recipes.forEach((recipe, index) => {
    const value = followRecipe(recipe, recipes)
    values[index] = value
  })

  return values[mainIdentifier]
}
