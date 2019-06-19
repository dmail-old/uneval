// This function would return recipes that does not contain default values
// for instance we'll consider extensible as false by default
// empty propertiesMap and symbolsMap can be omitted
// it would decrease the size of value string representation a bit
export const minifyRecipe = ({ recipeArray, mainIdentifier }) => {
  recipeArray.forEach((recipe) => {
    if (recipe.type === "composite") {
      if (recipe.prototypeIdentifier === undefined) delete recipe.prototypeIdentifier
      if (recipe.valueOfIdentifier === undefined) delete recipe.valueOfIdentifier
      if (recipe.extensible === true) delete recipe.extensible

      if (Object.keys(recipe.propertiesDescription).length === 0)
        delete recipe.propertiesDescription
      else {
        // here we could improve further by removing property descriptor default values
      }

      if (Object.keys(recipe.symbolsDescription).length === 0) delete recipe.symbolsDescription
      else {
        // here we could improve further by removing property descriptor default values
      }

      if (Object.keys(recipe.methodsDescription).length === 0) delete recipe.methodsDescription
    }
  })

  return { recipeArray, mainIdentifier }
}
