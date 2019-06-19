export function recompose(param) {
  var recipeArray = param.recipeArray
  var mainIdentifier = param.mainIdentifier
  var materials = {}

  // eslint-disable-next-line no-extend-native
  Object.defineProperty(Object.prototype, "__global__", {
    // eslint-disable-next-line object-shorthand
    get: function() {
      return this
    },
    configurable: true,
  })
  // eslint-disable-next-line no-undef
  var globalObject = __global__
  delete Object.prototype.__global__

  function setupMaterial(recipe) {
    if (recipe.type === "primitive") return setupPrimitiveMaterial(recipe)
    if (recipe.type === "global-symbol") return setupGlobalSymbolMaterial(recipe)
    if (recipe.type === "global-reference") return setupGlobalReferenceMaterial(recipe)
    return setupCompositeMaterial(recipe)
  }

  function setupPrimitiveMaterial(recipe) {
    return recipe.value
  }

  function setupGlobalSymbolMaterial(recipe) {
    return Symbol.for(recipe.key)
  }

  function setupGlobalReferenceMaterial(recipe) {
    var path = recipe.path
    var currentValue = globalObject
    var i = 0
    while (i < path.length) {
      var part = path[i]
      i++
      if (part in currentValue === false)
        throw new Error(createValueNotFoundErrorMessage({ path, index: i }))
      currentValue = currentValue[part]
    }
    return currentValue
  }

  function setupCompositeMaterial(recipe) {
    var prototypeIdentifier = recipe.prototypeIdentifier
    var valueOfIdentifier = recipe.valueOfIdentifier

    // regexp and function
    if (prototypeIdentifier === undefined) return materials[valueOfIdentifier]

    var prototypeValue = materials[prototypeIdentifier]
    if (prototypeValue === null) return Object.create(null)

    var Constructor = prototypeValue.constructor
    if (Constructor === Object) return Object.create(prototypeValue)

    if (valueOfIdentifier === undefined) return new Constructor()

    var valueOfValue = materials[valueOfIdentifier]
    return new Constructor(valueOfValue)
  }

  recipeArray.forEach(function(recipe, index) {
    var value = setupMaterial(recipe)
    materials[index] = value
  })

  function followRecipe(recipe, index) {
    if (recipe.type === "composite") followCompositeRecipe(recipe, index)
  }

  function followCompositeRecipe(recipe, index) {
    var composite = materials[index]

    var propertiesDescription = recipe.propertiesDescription
    if (propertiesDescription) {
      Object.keys(propertiesDescription).forEach(function(propertyNameIdentifier) {
        var propertyName = materials[propertyNameIdentifier]
        var description = propertiesDescription[propertyNameIdentifier]
        defineProperty(composite, propertyName, description)
      })
    }

    var symbolsDescription = recipe.symbolsDescription
    if (symbolsDescription) {
      Object.keys(symbolsDescription).forEach(function(symbolIdentifier) {
        var symbol = materials[symbolIdentifier]
        var description = symbolsDescription[symbolIdentifier]
        defineProperty(composite, symbol, description)
      })
    }

    var methodsDescription = recipe.methodsDescription
    if (methodsDescription) {
      Object.keys(methodsDescription).forEach(function(methodNameIdentifier) {
        var methodName = materials[methodNameIdentifier]
        var calls = methodsDescription[methodNameIdentifier]
        calls.forEach(function(argumentIdentifiers) {
          var argumentValues = argumentIdentifiers.map(function(argumentIdentifier) {
            return materials[argumentIdentifier]
          })
          composite[methodName](...argumentValues)
        })
      })
    }

    var extensible = recipe.extensible || true
    if (!extensible) Object.preventExtensions(composite)
  }

  function defineProperty(composite, propertyNameOrSymbol, propertyDescription) {
    var currentDescriptor = Object.getOwnPropertyDescriptor(composite, propertyNameOrSymbol)
    if (currentDescriptor && currentDescriptor.configurable === false) return

    var descriptor = {}
    Object.keys(propertyDescription).forEach(function(descriptorNameIdentifier) {
      var descriptorValueIdentifier = propertyDescription[descriptorNameIdentifier]
      var descriptorName = materials[descriptorNameIdentifier]
      var descriptorValue = materials[descriptorValueIdentifier]
      descriptor[descriptorName] = descriptorValue
    })
    Object.defineProperty(composite, propertyNameOrSymbol, descriptor)
  }

  recipeArray.forEach(function(recipe, index) {
    followRecipe(recipe, index)
  })

  function createValueNotFoundErrorMessage(data) {
    var path = data.path
    var index = data.index
    var message = "value not found for path."
    message += "\n"
    // eslint-disable-next-line prefer-template
    message += "part not found: " + path[index]
    message += "\n"
    // eslint-disable-next-line prefer-template
    message += "path: " + path.join("")
    return message
  }

  return materials[mainIdentifier]
}
