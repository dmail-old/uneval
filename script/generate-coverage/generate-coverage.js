const { cover } = require("@jsenv/core")
const { projectPath, testDescription, jsenvCoverDescription } = require("../../jsenv.config.js")

cover({
  projectPath,
  coverDescription: {
    ...jsenvCoverDescription,
    // because it will be evaluated outside its context
    // so it must not be instrumented, or we should
    // find a solution to instrument it
    "/src/recompose.js": false,
  },
  executeDescription: testDescription,
  logCoverageTable: true,
  writeCoverageHtmlFolder: true,
})
