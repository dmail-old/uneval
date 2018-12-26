const { forEachRessourceMatching } = require("@dmail/project-structure")
const {
  compileFile,
  fileSystemWriteCompileResult,
} = require("@dmail/project-structure-compile-babel")
const { localRoot, metaMap, plugins } = require("../config/project.config.js")

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
