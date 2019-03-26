const { test } = require("@jsenv/core")
const { projectFolder, compileInto, babelPluginDescription } = require("../../jsenv.config.js")
const { testDescription } = require("./test.config.js")
const importMap = require("../../importMap.json")

test({
  importMap,
  projectFolder,
  compileInto,
  executeDescription: testDescription,
  compileGroupCount: 2,
  babelPluginDescription,
  // launching more than one chromium instance
  // from one node process triggers the following warning
  // (node:41548) MaxListenersExceededWarning: Possible EventEmitter memory leak detected. 11 exit listeners added. Use emitter.setMaxListeners() to increase limit
  // but even worse: it decrease the performance of each subsequent
  // spawned chromium instance
  // check this: https://github.com/GoogleChrome/puppeteer/issues/1873
  // maybe each launchChromium should spawn a node process
  maxParallelExecution: 1,
})
