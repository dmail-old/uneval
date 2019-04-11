const { bundleBrowser } = require("@jsenv/core")
const { importMap, projectFolder, babelConfigMap } = require("../../jsenv.config.js")

bundleBrowser({
  importMap,
  projectFolder,
  into: "dist/browser",
  entryPointMap: {
    main: "index.js",
  },
  babelConfigMap,
  verbose: true,
})
