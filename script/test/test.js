const { test } = require("@jsenv/core")
const { importMap, projectFolder, compileInto, babelConfigMap } = require("../../jsenv.config.js")
const { executeDescription } = require("./test.config.js")

test({
  importMap,
  projectFolder,
  compileInto,
  executeDescription,
  compileGroupCount: 2,
  babelConfigMap,
})
