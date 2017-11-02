import { uneval } from "./uneval.js"
import { test } from "@dmail/test-cheap"
import assert from "assert"

const expectUneval = (value, expectedUneval) => assert.equal(uneval(value), expectedUneval)
const expectUnevalShort = (value, expectedUneval) =>
	assert.equal(uneval(value, { pretty: false }), expectedUneval)
const expectUnevalWithNew = (value, expectedUneval) =>
	assert.equal(uneval(value, { new: true }), expectedUneval)
const expectUnevalWithParenthesis = (value, expectedUneval) =>
	assert.equal(uneval(value, { parenthesis: true }), expectedUneval)
const expectUnevalWithNewAndParenthesis = (value, expectedUneval) =>
	assert.equal(uneval(value, { parenthesis: true, new: true }), expectedUneval)
const expectUnevalWithFunctionBody = (value, expectedUneval) =>
	assert.equal(uneval(value, { skipFunctionBody: false }), expectedUneval)

/* eslint-disable no-new-wrappers, no-new-object, no-array-constructor */

test("uneval.js", ({ ensure }) => {
	ensure("boolean uneval", () => {
		expectUneval(true, "true")
		expectUneval(false, "false")
		expectUneval(new Boolean(true), "Boolean(true)")
		expectUnevalWithParenthesis(new Boolean(true), "(Boolean(true))")
		expectUnevalWithNew(new Boolean(true), "new Boolean(true)")
		expectUnevalWithNewAndParenthesis(new Boolean(true), "new (Boolean(true))")
	})

	ensure("arrow function", () => {
		expectUneval(() => {}, `function`)
		const named = () => {}
		expectUneval(named, `function named`)
		expectUnevalWithFunctionBody(named, `function named() {}`)

		// because of babel most function body are converted back to regular function
		expectUnevalWithFunctionBody(() => {}, "function () {}")
		expectUnevalWithFunctionBody(
			() => true,
			`function () {
      return true;
    }`
		)
	})

	ensure("function", () => {
		// no need, arrow function are enougth
	})

	ensure("null", () => {
		expectUneval(null, "null")
	})

	ensure("number/Number", () => {
		expectUneval(0, "0")
		expectUneval(1, "1")
		expectUneval(new Number(0), "Number(0)")
		expectUnevalWithParenthesis(new Number(0), "(Number(0))")
		expectUnevalWithNew(new Number(0), "new Number(0)")
		expectUnevalWithNewAndParenthesis(new Number(0), "new (Number(0))")
	})

	ensure("object/Object", () => {
		const emptyObject = {}
		expectUneval(emptyObject, "{}")
		expectUneval(new Object({}), "{}")

		const foo = { foo: true, bar: false }
		expectUneval(
			foo,
			`{
	"foo": true,
	"bar": false
}`
		)
		expectUnevalShort(foo, `{ "foo": true, "bar": false }`)

		const objectWithInheritedEnumerableProperty = Object.create({
			foo: true
		})
		expectUneval(objectWithInheritedEnumerableProperty, "{}")

		const nested = { foo: { name: "dam" } }
		expectUneval(
			nested,
			`{
	"foo": {
		"name": "dam"
	}
}`
		)
		expectUnevalShort(nested, `{ "foo": { "name": "dam" } }`)

		const circularObject = {
			foo: true
		}
		circularObject.self = circularObject
		expectUneval(
			circularObject,
			`{
	"foo": true,
	"self": {}
}`
		)

		const nestedCircularObject = {
			foo: true
		}
		nestedCircularObject.nested = {
			bar: true,
			parent: nestedCircularObject
		}
		expectUneval(
			nestedCircularObject,
			`{
	"foo": true,
	"nested": {
		"bar": true,
		"parent": {}
	}
}`
		)
	})

	ensure("string/String", () => {
		expectUneval("", `""`)
		expectUneval("dam", `"dam"`)
		expectUneval("don't", `"don\\\'t"`)
		expectUneval(`his name is "dam"`, `"his name is \\\"dam\\\""`)
		expectUneval("a\nb", `"a\\nb"`)
		expectUneval("a\rb", `"a\\rb"`)
		expectUneval("a\u2028b", `"a\\u2028b"`)
		expectUneval("a\u2029b", `"a\\u2029b"`)
		expectUneval(new String(""), `String("")`)
		expectUneval(new String("dam"), `String("dam")`)
	})

	ensure("symbol/Symbol", () => {
		expectUneval(Symbol(), "symbol")
	})

	ensure("undefined", () => {
		expectUneval(undefined, "undefined")
	})

	ensure("regexp/Regexp", () => {
		expectUneval(/ok/g, "/ok/g")
		expectUneval(new RegExp("foo", "g"), "/foo/g")
	})

	ensure("Error", () => {
		expectUneval(new Error("here"), `Error("here")`)
		expectUneval(new RangeError("here"), `RangeError("here")`)
	})

	ensure("Date", () => {
		expectUneval(new Date(), `Date(${Date.now()})`)
	})

	ensure("literal array/Array", () => {
		const emptyArray = []
		expectUneval(emptyArray, `[]`)

		const newArray = new Array("foo", 1)
		expectUneval(
			newArray,
			`[
	"foo",
	1
]`
		)
		expectUnevalShort(newArray, `["foo", 1]`)

		const nestedArray = [[]]
		expectUnevalShort(nestedArray, `[[]]`)

		const circularArray = [0]
		circularArray.push(circularArray)
		expectUneval(
			circularArray,
			`[
	0,
	[]
]`
		)

		// other instance
		const CustomConstructor = function() {
			this.foo = true
		}
		const customInstance = new CustomConstructor()
		expectUneval(
			customInstance,
			`CustomConstructor({
	"foo": true
})`
		)

		expectUneval(
			[Symbol()],
			`[
	symbol
]`
		)
	})
})

/* eslint-enable no-new-wrappers, no-new-object */
