// be carefull for now this function is mutating recipe
// array!!!
// this is not an issue because it is used only by uneval on a recipes
// array of recipe which not accessible from outisde
export const sortRecipes = (recipes) => {
  const findInRecipePrototypeChain = (recipe, callback) => {
    let currentRecipe = recipe
    // eslint-disable-next-line no-constant-condition
    while (true) {
      if (currentRecipe.type !== "composite") break
      const prototypeIdentifier = currentRecipe.prototypeIdentifier
      currentRecipe = recipes[prototypeIdentifier]

      if (callback(currentRecipe, prototypeIdentifier)) return prototypeIdentifier
    }
    return undefined
  }

  const recipesSorted = recipes.slice().sort((leftRecipe, rightRecipe) => {
    const leftType = leftRecipe.type
    const rightType = rightRecipe.type

    if (leftType === "composite" && rightType === "composite") {
      const rightRecipeIsInLeftRecipePrototypeChain = findInRecipePrototypeChain(
        leftRecipe,
        (recipeCandidate) => recipeCandidate === rightRecipe,
      )
      // if left recipe requires right recipe, left must be after right
      if (rightRecipeIsInLeftRecipePrototypeChain) return 1

      const leftRecipeIsInRightRecipePrototypeChain = findInRecipePrototypeChain(
        rightRecipe,
        (recipeCandidate) => recipeCandidate === leftRecipe,
      )
      // if right recipe requires left recipe, right must be after left
      if (leftRecipeIsInRightRecipePrototypeChain) return -1

      return 0
    }

    if (leftType !== rightType) {
      // if left is a composite, left must be after right
      if (leftType === "composite") return 1
      // if right is a composite, right must be after left
      if (rightType === "composite") return -1
      // other types are independant
      return 0
    }

    // other types are independant
    return 0
  })

  const moves = {}
  recipes.forEach((recipe, index) => {
    const sortedIndex = recipesSorted.indexOf(recipe)
    if (index !== sortedIndex) {
      moves[index] = sortedIndex
    }
  })

  const remapIdentifier = (identifier) => {
    if (identifier in moves) return moves[identifier]
    return identifier
  }

  const remapPropertyDescription = (propertyDescription) => {
    const remappedPropertyDescription = {}
    Object.keys(propertyDescription).forEach((descriptorNameIdentifier) => {
      remappedPropertyDescription[remapIdentifier(descriptorNameIdentifier)] = remapIdentifier(
        propertyDescription[descriptorNameIdentifier],
      )
    })
    return remappedPropertyDescription
  }

  recipes.forEach((recipe) => {
    if (recipe.type !== "composite") return

    recipe.valueOfIdentifier = remapIdentifier(recipe.valueOfIdentifier)
    recipe.prototypeIdentifier = remapIdentifier(recipe.prototypeIdentifier)

    const propertiesMap = recipe.propertiesMap
    const remappedPropertiesMap = {}
    Object.keys(propertiesMap).forEach((propertyNameIdentifier) => {
      remappedPropertiesMap[remapIdentifier(propertyNameIdentifier)] = remapPropertyDescription(
        propertiesMap[propertyNameIdentifier],
      )
    })
    recipe.propertiesMap = remappedPropertiesMap

    const symbolsMap = recipe.symbolsMap
    const remappedSymbolsMap = {}
    Object.keys(symbolsMap).forEach((symbolIdentifier) => {
      remappedSymbolsMap[remapIdentifier(symbolIdentifier)] = remapPropertyDescription(
        symbolsMap[symbolIdentifier],
      )
    })
    recipe.symbolsMap = remappedSymbolsMap
  })

  return recipesSorted
}
