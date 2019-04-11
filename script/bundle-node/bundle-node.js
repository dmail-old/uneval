const { bundleNode } = require("@jsenv/core")
const { importMap, projectFolder, babelConfigMap } = require("../../jsenv.config.js")

bundleNode({
  importMap,
  projectFolder,
  into: "dist/node",
  entryPointMap: {
    main: "index.js",
  },
  babelConfigMap,
  verbose: true,
})
