// https://github.com/jsenv/core/blob/959e76068b62c23d7047f6a8c7a3d6582ac25177/src/api/util/uneval.js

// https://github.com/joliss/js-string-escape/blob/master/index.js
// http://javascript.crockford.com/remedial.html
const quote = value => {
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

const getPrimitiveType = value => {
	if (value === null) {
		return "null"
	}
	if (value === undefined) {
		return "undefined"
	}
	return typeof value
}

const toString = Object.prototype.toString
const getCompositeType = object => {
	const toStringResult = toString.call(object)
	// returns format is '[object ${tagName}]';
	// and we want ${tagName}
	const tagName = toStringResult.slice("[object ".length, -1)
	if (tagName === "Object") {
		const objectConstructorName = object.constructor.name
		if (objectConstructorName !== "Object") {
			return objectConstructorName
		}
	}
	return tagName
}

const hasOwnProperty = Object.prototype.hasOwnProperty
function getPropertyNames(value) {
	const names = []
	for (let name in value) {
		if (hasOwnProperty.call(value, name)) {
			names.push(name)
		}
	}
	return names
}

const newLineAndIndentation = indent => "\n" + "\t".repeat(indent) // eslint-disable-line prefer-template

const primitiveSources = {}
const compositeSources = {}

Object.assign(primitiveSources, {
	boolean: boolean => boolean.toString(),
	function: (fn, { format, skipFunctionBody }) => {
		if (skipFunctionBody) {
			return fn.name ? `function ${fn.name}` : "function"
		}
		return format(fn.toString())
	},
	null: () => "null",
	number: number => number.toString(),
	object: (object, { unevalComposite }) => unevalComposite(getCompositeType(object), object),
	string: string => `"${quote(string)}"`,
	symbol: (symbol, { format }) => format("symbol"),
	undefined: () => "undefined"
})
const unevalInstance = (instance, { type, uneval, format }) =>
	format(`${type}(${uneval(instance.valueOf())})`)
Object.assign(compositeSources, {
	Array: (array, { seen, depth, uneval, format, pretty }) => {
		if (seen) {
			if (seen.indexOf(array) > -1) {
				return "[]"
			}
			seen.push(array)
		} else {
			seen = [array]
		}
		depth = depth ? depth + 1 : 1

		let valuesSource = ""
		let i = 0
		const j = array.length

		while (i < j) {
			const valueSource = uneval(array[i], { seen, depth })
			if (pretty) {
				if (i === 0) {
					valuesSource += valueSource
				} else {
					valuesSource += `,${newLineAndIndentation(depth)}${valueSource}`
				}
			} else if (i === 0) {
				valuesSource += valueSource
			} else {
				valuesSource += `, ${valueSource}`
			}
			i++
		}

		let arraySource
		if (valuesSource.length) {
			if (pretty) {
				arraySource = `[${newLineAndIndentation(depth)}${valuesSource}${newLineAndIndentation(
					depth - 1
				)}]`
			} else {
				arraySource = `[${valuesSource}]`
			}
		} else {
			arraySource = "[]"
		}

		return format(arraySource)
	},
	Boolean: unevalInstance,
	Date: unevalInstance,
	Error: (error, { expose }) => unevalInstance(error.message, expose({ type: error.name })),
	Number: unevalInstance,
	RegExp: regexp => regexp.toString(),
	Object: (object, { seen, depth, uneval, format, pretty }) => {
		if (seen) {
			if (seen.indexOf(object) > -1) {
				return "{}"
			}
			seen.push(object)
		} else {
			seen = [object]
		}
		depth = depth ? depth + 1 : 1

		let propertiesSource = ""
		const propertyNames = getPropertyNames(object)
		let i = 0
		const j = propertyNames.length

		while (i < j) {
			const propertyName = propertyNames[i]
			const propertyNameSource = uneval(propertyName)
			const propertyValueSource = uneval(object[propertyName], { seen, depth })

			if (pretty) {
				if (i === 0) {
					propertiesSource += `${propertyNameSource}: ${propertyValueSource}`
				} else {
					propertiesSource += `,${newLineAndIndentation(
						depth
					)}${propertyNameSource}: ${propertyValueSource}`
				}
			} else if (i === 0) {
				propertiesSource += `${propertyNameSource}: ${propertyValueSource}`
			} else {
				propertiesSource += `, ${propertyNameSource}: ${propertyValueSource}`
			}

			i++
		}

		let objectSource
		if (propertiesSource.length) {
			if (pretty) {
				objectSource = `{${newLineAndIndentation(depth)}${propertiesSource}${newLineAndIndentation(
					depth - 1
				)}}`
			} else {
				objectSource = `{ ${propertiesSource} }`
			}
		} else {
			objectSource = "{}"
		}

		return format(objectSource)
	},
	String: unevalInstance,
	// Symbol: (symbol, { unevalPrimitive }) => unevalPrimitive("symbol", symbol),
	// ici faudrais désactiver les parenthèses jusque pour l'object qu'on uneval
	// mais préserver la valeur par défaut pour ceux qui sont nested
	Other: (object, { type, format, unevalComposite }) =>
		format(`${type}(${unevalComposite("Object", object)})`)
})

export const uneval = (
	value,
	options = {
		parenthesis: false,
		new: false,
		skipFunctionBody: false,
		pretty: true
	}
) => {
	const expose = (...properties) => Object.assign({}, options, ...properties)

	const localUneval = (value, localOptions = {}) => uneval(value, expose(localOptions))

	const format = string => {
		let formattedString = string
		if (options.parenthesis) {
			formattedString = `(${string})`
		}
		if (options.new) {
			formattedString = `new ${formattedString}`
		}
		return formattedString
	}
	const unevalPrimitive = (type, value) => primitiveSources[type](value, expose({ type }))
	const unevalComposite = (type, value) => {
		const handlerType = type in compositeSources ? type : "Other"
		return compositeSources[handlerType](value, expose({ type }))
	}

	Object.assign(options, {
		expose,
		uneval: localUneval,
		format,
		unevalPrimitive,
		unevalComposite
	})

	return unevalPrimitive(getPrimitiveType(value), value)
}
