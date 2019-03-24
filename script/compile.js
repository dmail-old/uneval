const { transformAsync } = require("@babel/core")
const {
  pluginOptionMapToPluginMap,
  pluginMapToPluginsForPlatform,
  fileSystemWriteCompileResult,
} = require("@dmail/project-structure-compile-babel")
const {
  namedValueDescriptionToMetaDescription,
  selectAllFileInsideFolder,
} = require("@dmail/project-structure")
const { projectFolder } = require("./util.js")
const { readFile } = require("./readFile.js")

const metaDescription = namedValueDescriptionToMetaDescription({
  compile: {
    "/**/*.js": true,
    "/node_modules/": false,
    "/dist/": false,
    "/script/": false,
    "/.eslintrc.js": false,
    "/prettier.config.js": false,
  },
})

const pluginMap = pluginOptionMapToPluginMap({
  "transform-modules-commonjs": {},
  "proposal-async-generator-functions": {},
  "proposal-json-strings": {},
  "proposal-object-rest-spread": {},
  "proposal-optional-catch-binding": {},
  "proposal-unicode-property-regex": {},
  "transform-arrow-functions": {},
  "transform-async-to-generator": {},
  "transform-block-scoped-functions": {},
  "transform-block-scoping": {},
  "transform-classes": {},
  "transform-computed-properties": {},
  "transform-destructuring": {},
  "transform-dotall-regex": {},
  "transform-duplicate-keys": {},
  "transform-exponentiation-operator": {},
  "transform-for-of": {},
  "transform-function-name": {},
  "transform-literals": {},
  "transform-new-target": {},
  "transform-object-super": {},
  "transform-parameters": {},
  "transform-regenerator": {},
  "transform-shorthand-properties": {},
  "transform-spread": {},
  "transform-sticky-regex": {},
  "transform-template-literals": {},
  "transform-typeof-symbol": {},
  "transform-unicode-regex": {},
})

const plugins = pluginMapToPluginsForPlatform(pluginMap, "node", "8.0.0")

const outputFolder = `dist`

selectAllFileInsideFolder({
  pathname: projectFolder,
  metaDescription,
  predicate: ({ compile }) => compile,
  transformFile: async ({ filenameRelative }) => {
    const filename = `${projectFolder}/${filenameRelative}`
    const source = await readFile(filename)

    const { code, map } = await transformAsync(source, {
      plugins,
      filenameRelative,
      filename,
      sourceMaps: true,
      sourceFileName: filenameRelative,
    })

    await fileSystemWriteCompileResult(
      {
        code,
        map,
      },
      {
        localRoot: projectFolder,
        outputFile: filenameRelative,
        outputFolder,
      },
    )

    console.log(`${filenameRelative} -> ${outputFolder}/${filenameRelative}`)
  },
})
