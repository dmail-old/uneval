const {
  pluginOptionMapToPluginMap,
  pluginMapToPluginsForPlatform,
  compileFile,
  fileSystemWriteCompileResult,
} = require("@dmail/project-structure-compile-babel")
const { patternGroupToMetaMap, forEachRessourceMatching } = require("@dmail/project-structure")
const { localRoot } = require("./util.js")

const metaMap = patternGroupToMetaMap({
  compile: {
    "**/*.js": true,
    node_modules: false, // eslint-disable-line camelcase
    dist: false,
    script: false,
    config: false,
    ".eslintrc.js": false,
    "prettier.config.js": false,
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

forEachRessourceMatching({
  localRoot,
  metaMap,
  predicate: ({ compile }) => compile,
  callback: async (ressource) => {
    const { code, map } = await compileFile(ressource, { localRoot, plugins })
    const outputFolder = `dist`

    await fileSystemWriteCompileResult(
      {
        code,
        map,
      },
      {
        localRoot,
        outputFile: ressource,
        outputFolder,
      },
    )

    console.log(`${ressource} -> ${outputFolder}/${ressource}`)
  },
})
