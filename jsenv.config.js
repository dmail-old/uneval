const {
  babelPluginDescription,
} = require("./node_modules/@jsenv/babel-plugin-description/index.js")

const projectFolder = __dirname
exports.projectFolder = projectFolder

const entryPointsDescription = {
  main: "index.js",
}
exports.entryPointsDescription = entryPointsDescription

const compileInto = ".dist"
exports.compileInto = compileInto

exports.babelPluginDescription = babelPluginDescription

// could add nodeUsageMap and browserUsageMap
