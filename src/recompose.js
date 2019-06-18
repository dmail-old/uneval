export const recompose = ({ recipeArray, mainIdentifier }) => {
  const globalObject = typeof window === "object" ? window : global
  const materials = {}

  const setupMaterial = (recipe) => {
    if (recipe.type === "primitive") return setupPrimitiveMaterial(recipe)
    if (recipe.type === "global-symbol") return setupGlobalSymbolMaterial(recipe)
    if (recipe.type === "global-reference") return setupGlobalReferenceMaterial(recipe)
    return setupCompositeMaterial(recipe)
  }

  const setupPrimitiveMaterial = ({ value }) => value

  const setupGlobalSymbolMaterial = ({ key }) => Symbol.for(key)

  const setupGlobalReferenceMaterial = ({ path }) => {
    let currentValue = globalObject
    let i = 0
    while (i < path.length) {
      const part = path[i]
      i++
      if (part in currentValue === false)
        throw new Error(createValueNotFoundErrorMessage({ path, index: i }))
      currentValue = currentValue[part]
    }
    return currentValue
  }

  const setupCompositeMaterial = ({ prototypeIdentifier, valueOfIdentifier }) => {
    const prototypeValue = materials[prototypeIdentifier]
    if (prototypeValue === null) return Object.create(null)

    const Constructor = prototypeValue.constructor
    if (Constructor === Object) return Object.create(prototypeValue)

    if (valueOfIdentifier === undefined) return new Constructor()

    const valueOfValue = materials[valueOfIdentifier]
    return new Constructor(valueOfValue)
  }

  recipeArray.forEach((recipe, index) => {
    const value = setupMaterial(recipe)
    materials[index] = value
  })

  const followRecipe = (recipe, index) => {
    if (recipe.type === "composite") followCompositeRecipe(recipe, index)
  }

  const followCompositeRecipe = (
    { propertiesDescription, symbolsDescription, extensible = true },
    index,
  ) => {
    const composite = materials[index]

    if (propertiesDescription) {
      Object.keys(propertiesDescription).forEach((propertyNameIdentifier) => {
        const propertyName = materials[propertyNameIdentifier]
        const description = propertiesDescription[propertyNameIdentifier]
        defineProperty(composite, propertyName, description)
      })
    }

    if (symbolsDescription) {
      Object.keys(symbolsDescription).forEach((symbolIdentifier) => {
        const symbol = materials[symbolIdentifier]
        const description = symbolsDescription[symbolIdentifier]
        defineProperty(composite, symbol, description)
      })
    }

    if (!extensible) Object.preventExtensions(composite)
  }

  const defineProperty = (composite, propertyNameOrSymbol, propertyDescription) => {
    const currentDescriptor = Object.getOwnPropertyDescriptor(composite, propertyNameOrSymbol)
    if (currentDescriptor && currentDescriptor.configurable === false) return

    const descriptor = {}
    Object.keys(propertyDescription).forEach((descriptorNameIdentifier) => {
      const descriptorValueIdentifier = propertyDescription[descriptorNameIdentifier]
      const descriptorName = materials[descriptorNameIdentifier]
      const descriptorValue = materials[descriptorValueIdentifier]
      descriptor[descriptorName] = descriptorValue
    })
    Object.defineProperty(composite, propertyNameOrSymbol, descriptor)
  }

  recipeArray.forEach((recipe, index) => {
    followRecipe(recipe, index)
  })

  const createValueNotFoundErrorMessage = ({ path, index }) => `value not found for path.
part not found: ${path[index]}
path: ${path.join(",")}`

  return materials[mainIdentifier]
}
