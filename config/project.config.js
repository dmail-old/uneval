const path = require("path")
const { configToMetaMap } = require("@dmail/project-structure")
const eslintConfig = require("@dmail/project-eslint-config").config
const prettierConfig = require("@dmail/project-prettier-config")
const {
  pluginOptionMapToPluginMap,
  pluginMapToPluginsForPlatform,
} = require("@dmail/project-structure-compile-babel")
const structureConfig = require("./structure.config.js")

const localRoot = path.resolve(__dirname, "../")

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

const metaMap = configToMetaMap(structureConfig)

module.exports = {
  localRoot,
  prettier: prettierConfig,
  eslint: eslintConfig,
  metaMap,
  pluginMap,
  plugins,
}
