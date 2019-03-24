const { test } = require("@jsenv/core")
const { projectFolder, compileInto, babelPluginDescription } = require("../../jsenv.config.js")
const { testDescription } = require("./test.config.js")
const importMap = require("../../importMap.json")

test({
  importMap,
  projectFolder,
  compileInto,
  executeDescription: testDescription,
  babelPluginDescription,
})
